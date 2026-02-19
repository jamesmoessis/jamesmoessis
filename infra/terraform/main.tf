provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

locals {
  project     = "jamesmoessis"
  zone_name   = "jamesmoessis.com"
  apex_domain = "jamesmoessis.com"
  www_domain  = "www.jamesmoessis.com"
}

data "aws_route53_zone" "primary" {
  name         = "${local.zone_name}."
  private_zone = false
}

resource "random_id" "tf_state_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "tf_state" {
  bucket = "${local.project}-terraform-state-${random_id.tf_state_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "tf_state" {
  bucket = aws_s3_bucket.tf_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tf_state" {
  bucket = aws_s3_bucket.tf_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tf_state" {
  bucket                  = aws_s3_bucket.tf_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "www" {
  bucket = local.www_domain
}

resource "aws_s3_bucket" "apex" {
  bucket = local.apex_domain
}

resource "aws_s3_bucket_public_access_block" "www" {
  bucket                  = aws_s3_bucket.www.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_public_access_block" "apex" {
  bucket                  = aws_s3_bucket.apex.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "www" {
  bucket = aws_s3_bucket.www.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_website_configuration" "apex" {
  bucket = aws_s3_bucket.apex.id

  redirect_all_requests_to {
    host_name = local.www_domain
    protocol  = "https"
  }
}

resource "aws_s3_bucket_policy" "www_public_read" {
  bucket = aws_s3_bucket.www.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.www.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.www]
}

resource "aws_s3_bucket_policy" "apex_public_read" {
  bucket = aws_s3_bucket.apex.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.apex.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.apex]
}

resource "aws_acm_certificate" "site" {
  provider                  = aws.us_east_1
  domain_name               = local.apex_domain
  subject_alternative_names = [local.www_domain]
  validation_method         = "DNS"
}

resource "aws_route53_record" "cert_validation" {
  for_each = toset([local.apex_domain, local.www_domain])

  # ACM returns validation options as a set, so we select the entry for each
  # known domain explicitly to keep for_each keys static.
  name = one([
    for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_name
    if option.domain_name == each.key
  ])
  records = [one([
    for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_value
    if option.domain_name == each.key
  ])]
  type = one([
    for option in aws_acm_certificate.site.domain_validation_options : option.resource_record_type
    if option.domain_name == each.key
  ])

  zone_id         = data.aws_route53_zone.primary.zone_id
  ttl             = 300
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "site" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.site.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert_validation : record.fqdn
  ]
}

resource "aws_cloudfront_distribution" "www" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [local.www_domain]

  origin {
    domain_name = aws_s3_bucket_website_configuration.www.website_endpoint
    origin_id   = "s3-website-${local.www_domain}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-website-${local.www_domain}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }
}

resource "aws_cloudfront_distribution" "apex" {
  enabled         = true
  is_ipv6_enabled = true
  aliases         = [local.apex_domain]

  origin {
    domain_name = aws_s3_bucket_website_configuration.apex.website_endpoint
    origin_id   = "s3-website-${local.apex_domain}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-website-${local.apex_domain}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_route53_record" "www_ipv4" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.www_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_ipv6" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.www_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.www.domain_name
    zone_id                = aws_cloudfront_distribution.www.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_ipv4" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.apex_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.apex.domain_name
    zone_id                = aws_cloudfront_distribution.apex.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_ipv6" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.apex_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.apex.domain_name
    zone_id                = aws_cloudfront_distribution.apex.hosted_zone_id
    evaluate_target_health = false
  }
}

output "terraform_state_bucket" {
  value       = aws_s3_bucket.tf_state.bucket
  description = "Bucket created for Terraform remote state."
}

output "www_cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.www.domain_name
  description = "CloudFront domain serving www.jamesmoessis.com."
}

output "apex_cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.apex.domain_name
  description = "CloudFront domain redirecting jamesmoessis.com to www."
}

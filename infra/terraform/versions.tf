terraform {
  required_version = ">= 1.14.0"
  backend "s3" {
    bucket  = "jamesmoessis-terraform-state-8a10857a"
    key     = "infra/terraform.tfstate"
    region  = "ap-southeast-2"
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

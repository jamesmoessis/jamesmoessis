package main

// ChordQuality represents the type of chord (maj7, min7, dom7, etc.)
type ChordQuality int

const (
	Maj7 ChordQuality = iota
	Min7
	Dom7
	HalfDim7 // min7b5
	Dim7
)

func (q ChordQuality) String() string {
	switch q {
	case Maj7:
		return "maj7"
	case Min7:
		return "m7"
	case Dom7:
		return "7"
	case HalfDim7:
		return "m7b5"
	case Dim7:
		return "dim7"
	default:
		return "?"
	}
}

// ChordFunction represents a chord's role relative to the current key.
// Uses roman numeral naming: I, ii, iii, IV, V, vi, vii.
type ChordFunction int

const (
	I_Maj7  ChordFunction = iota // Imaj7
	II_Min7                      // ii7
	III_Min7                     // iii7
	IV_Maj7                      // IVmaj7
	V_Dom7                       // V7
	VI_Min7                      // vi7
	VII_HalfDim7                 // viim7b5

	// Chromatic / borrowed functions
	SubV7       // tritone sub (bII7)
	SecV_of_II  // secondary dominant → ii (VI7)
	SecV_of_III // secondary dominant → iii (VII7)
	SecV_of_IV  // secondary dominant → IV (I7)
	SecV_of_V   // secondary dominant → V (II7)
	SecV_of_VI  // secondary dominant → vi (III7)
	BVII_Maj7   // borrowed bVIImaj7 (backdoor)
	IV_Min7     // modal interchange iv minor
)

// ChordFunctionInfo stores the display info for a chord function.
type ChordFunctionInfo struct {
	Quality    ChordQuality
	SemiOffset int    // semitones above the key root
	Label      string // roman numeral label
}

var chordFunctions = map[ChordFunction]ChordFunctionInfo{
	I_Maj7:       {Maj7, 0, "Imaj7"},
	II_Min7:      {Min7, 2, "ii7"},
	III_Min7:     {Min7, 4, "iii7"},
	IV_Maj7:      {Maj7, 5, "IVmaj7"},
	V_Dom7:       {Dom7, 7, "V7"},
	VI_Min7:      {Min7, 9, "vi7"},
	VII_HalfDim7: {HalfDim7, 11, "viim7b5"},
	SubV7:        {Dom7, 1, "bII7"},
	SecV_of_II:   {Dom7, 9, "V/ii"},
	SecV_of_III:  {Dom7, 11, "V/iii"},
	SecV_of_IV:   {Dom7, 0, "V/IV"},
	SecV_of_V:    {Dom7, 2, "V/V"},
	SecV_of_VI:   {Dom7, 4, "V/vi"},
	BVII_Maj7:    {Maj7, 10, "bVIImaj7"},
	IV_Min7:      {Min7, 5, "iv7"},
}

// Note names for building chord symbols.
var noteNames = []string{"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"}

// ChordName returns the full chord symbol (e.g. "Dm7") given a key root and function.
func ChordName(keyRoot int, fn ChordFunction) string {
	info := chordFunctions[fn]
	noteIdx := (keyRoot + info.SemiOffset) % 12
	return noteNames[noteIdx] + info.Quality.String()
}

// ChordLabel returns the roman numeral label for display.
func ChordLabel(fn ChordFunction) string {
	return chordFunctions[fn].Label
}

// Transition represents a possible next chord with a weight.
// Higher weight = more common / more consonant resolution.
type Transition struct {
	To     ChordFunction
	Weight int // 1=rare, 2=uncommon, 3=common, 4=very common
}

// transitionGraph defines the valid next chords for each chord function.
// This encodes standard jazz harmony rules.
var transitionGraph = map[ChordFunction][]Transition{
	I_Maj7: {
		{II_Min7, 4},      // I → ii (start ii-V-I)
		{IV_Maj7, 3},      // I → IV
		{VI_Min7, 3},      // I → vi
		{III_Min7, 2},     // I → iii
		{SecV_of_II, 2},   // I → V/ii (secondary dominant)
		{V_Dom7, 2},       // I → V
		{IV_Min7, 1},      // I → iv (modal interchange)
		{VII_HalfDim7, 1}, // I → vii (passing)
	},
	II_Min7: {
		{V_Dom7, 4},     // ii → V (the classic ii-V)
		{SubV7, 2},      // ii → bII7 (tritone sub for V)
		{III_Min7, 1},   // ii → iii
		{SecV_of_V, 2},  // ii → V/V (heading to V via its secondary dom)
		{VII_HalfDim7, 1},
	},
	III_Min7: {
		{VI_Min7, 4},    // iii → vi (circle of 5ths)
		{IV_Maj7, 3},    // iii → IV
		{SecV_of_VI, 2}, // iii → V/vi
		{II_Min7, 2},    // iii → ii
	},
	IV_Maj7: {
		{V_Dom7, 4},       // IV → V
		{II_Min7, 3},      // IV → ii
		{I_Maj7, 2},       // IV → I (plagal motion)
		{IV_Min7, 2},      // IV → iv (major to minor interchange)
		{VII_HalfDim7, 1}, // IV → vii
		{SubV7, 1},        // IV → bII7
	},
	V_Dom7: {
		{I_Maj7, 4},     // V → I (standard resolution)
		{VI_Min7, 3},    // V → vi (deceptive cadence)
		{III_Min7, 1},   // V → iii (mediant sub)
		{BVII_Maj7, 1},  // V → bVII
		{IV_Maj7, 1},    // V → IV (retrogression, used in blues)
	},
	VI_Min7: {
		{II_Min7, 4},    // vi → ii (circle of 5ths)
		{IV_Maj7, 3},    // vi → IV
		{V_Dom7, 2},     // vi → V
		{SecV_of_II, 2}, // vi → V/ii
		{III_Min7, 1},   // vi → iii
	},
	VII_HalfDim7: {
		{III_Min7, 4},   // vii → iii (resolution)
		{I_Maj7, 2},     // vii → I
		{VI_Min7, 2},    // vii → vi
	},

	// Chromatic / borrowed chord resolutions
	SubV7: {
		{I_Maj7, 4},  // bII7 → I (tritone sub resolution)
		{II_Min7, 1}, // bII7 → ii
	},
	SecV_of_II: {
		{II_Min7, 4}, // V/ii → ii
		{IV_Maj7, 1}, // deceptive resolution
	},
	SecV_of_III: {
		{III_Min7, 4}, // V/iii → iii
	},
	SecV_of_IV: {
		{IV_Maj7, 4}, // V/IV → IV
		{IV_Min7, 1}, // V/IV → iv
	},
	SecV_of_V: {
		{V_Dom7, 4},  // V/V → V
		{SubV7, 1},   // V/V → bII7 (tritone sub chain)
	},
	SecV_of_VI: {
		{VI_Min7, 4}, // V/vi → vi
	},
	BVII_Maj7: {
		{I_Maj7, 4},  // bVII → I (backdoor resolution)
		{IV_Maj7, 2}, // bVII → IV
		{V_Dom7, 1},  // bVII → V
	},
	IV_Min7: {
		{I_Maj7, 3},    // iv → I (minor plagal cadence)
		{V_Dom7, 3},    // iv → V
		{BVII_Maj7, 2}, // iv → bVII (backdoor setup)
		{SubV7, 1},     // iv → bII7
	},
}

// NextChordOptions returns the valid next chord functions for a given current chord,
// sorted by weight (highest first). Returns up to maxOptions results.
func NextChordOptions(current ChordFunction, maxOptions int) []Transition {
	transitions := transitionGraph[current]
	if len(transitions) == 0 {
		// Fallback: return diatonic options from I
		return []Transition{
			{II_Min7, 4},
			{V_Dom7, 3},
			{IV_Maj7, 2},
			{VI_Min7, 1},
		}
	}

	// Sort by weight descending (insertion sort, small slices)
	sorted := make([]Transition, len(transitions))
	copy(sorted, transitions)
	for i := 1; i < len(sorted); i++ {
		for j := i; j > 0 && sorted[j].Weight > sorted[j-1].Weight; j-- {
			sorted[j], sorted[j-1] = sorted[j-1], sorted[j]
		}
	}

	if maxOptions > 0 && len(sorted) > maxOptions {
		sorted = sorted[:maxOptions]
	}
	return sorted
}

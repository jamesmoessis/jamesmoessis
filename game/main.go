package main

import (
	"fmt"
	"image/color"
	"log"
	"math"

	"github.com/hajimehoshi/ebiten/v2"
	"github.com/hajimehoshi/ebiten/v2/ebitenutil"
	"github.com/hajimehoshi/ebiten/v2/inpututil"
	"github.com/hajimehoshi/ebiten/v2/vector"
)

const (
	screenW = 800
	screenH = 480

	defaultBPM  = 100
	beatsPerBar = 4
	maxOptions  = 5
	barWidthPx  = 160
	barHeightPx = 60
	barY        = 180
	optionY     = 320
	optionW     = 120
	optionH     = 50
	optionGap   = 10
	barLineX    = 400

	buttonW = 160
	buttonH = 50

	// Reset button position (top-right area)
	resetX = screenW - buttonW - 20
	resetY = 40
)

type GameState int

const (
	StateTitle   GameState = iota
	StatePlaying
)

var (
	bgColor         = color.RGBA{R: 15, G: 20, B: 35, A: 255}
	barColor        = color.RGBA{R: 40, G: 60, B: 100, A: 255}
	activeBarColor  = color.RGBA{R: 60, G: 100, B: 160, A: 255}
	pendingBarColor = color.RGBA{R: 30, G: 40, B: 70, A: 255}
	barLineColor    = color.RGBA{R: 255, G: 200, B: 80, A: 200}
	optionColors    = []color.RGBA{
		{R: 50, G: 120, B: 80, A: 255},
		{R: 50, G: 80, B: 140, A: 255},
		{R: 120, G: 60, B: 120, A: 255},
		{R: 140, G: 100, B: 40, A: 255},
		{R: 100, G: 50, B: 50, A: 255},
	}
	hoveredOverlay = color.RGBA{R: 255, G: 255, B: 255, A: 40}
	buttonColor    = color.RGBA{R: 50, G: 130, B: 80, A: 255}
	resetColor     = color.RGBA{R: 130, G: 50, B: 50, A: 255}
)

type Bar struct {
	ChordFunc ChordFunction
	Chosen    bool
}

type Game struct {
	state   GameState
	keyRoot int
	bpm     float64
	bars    []Bar
	options []Transition
	scrollX float64
	hovered int
	nextBar int
}

func NewGame() *Game {
	return &Game{
		state:   StateTitle,
		keyRoot: 0,
		bpm:     defaultBPM,
		hovered: -1,
	}
}

func (g *Game) startPlaying() {
	g.state = StatePlaying
	g.bars = []Bar{{ChordFunc: I_Maj7, Chosen: true}}
	g.nextBar = 1
	g.scrollX = 0
	g.hovered = -1
	g.refreshOptions()
}

func (g *Game) reset() {
	g.state = StateTitle
	g.bars = nil
	g.options = nil
	g.scrollX = 0
	g.nextBar = 0
	g.hovered = -1
}

func (g *Game) refreshOptions() {
	current := g.bars[len(g.bars)-1].ChordFunc
	g.options = NextChordOptions(current, maxOptions)
}

func (g *Game) framesPerBar() float64 {
	secondsPerBar := float64(beatsPerBar) / (g.bpm / 60.0)
	return secondsPerBar * float64(ebiten.TPS())
}

func (g *Game) barXPosition(barIndex int) float64 {
	return float64(barLineX) + float64(barIndex)*float64(barWidthPx) - g.scrollX*float64(barWidthPx)
}

func (g *Game) Update() error {
	switch g.state {
	case StateTitle:
		g.updateTitle()
	case StatePlaying:
		g.updatePlaying()
	}
	return nil
}

func (g *Game) updateTitle() {
	if inpututil.IsMouseButtonJustPressed(ebiten.MouseButtonLeft) {
		mx, my := ebiten.CursorPosition()
		bx := (screenW - buttonW) / 2
		by := 200
		if mx >= bx && mx < bx+buttonW && my >= by && my < by+buttonH {
			g.startPlaying()
			return
		}
	}
	if inpututil.IsKeyJustPressed(ebiten.KeyEnter) || inpututil.IsKeyJustPressed(ebiten.KeySpace) {
		g.startPlaying()
	}

	// BPM adjustment on title screen too
	if inpututil.IsKeyJustPressed(ebiten.KeyUp) {
		g.bpm = math.Min(g.bpm+10, 240)
	}
	if inpututil.IsKeyJustPressed(ebiten.KeyDown) {
		g.bpm = math.Max(g.bpm-10, 40)
	}
}

func (g *Game) updatePlaying() {
	g.handlePlayingInput()
	if g.state != StatePlaying {
		return
	}

	fpb := g.framesPerBar()
	g.scrollX += 1.0 / fpb

	if g.scrollX >= float64(g.nextBar) {
		if g.nextBar >= len(g.bars) {
			lastFunc := g.bars[len(g.bars)-1].ChordFunc
			g.bars = append(g.bars, Bar{ChordFunc: lastFunc, Chosen: false})
			g.refreshOptions()
		}
		g.nextBar++
	}
}

func (g *Game) handlePlayingInput() {
	mx, my := ebiten.CursorPosition()
	g.hovered = -1

	// Reset button check
	if inpututil.IsMouseButtonJustPressed(ebiten.MouseButtonLeft) {
		if mx >= resetX && mx < resetX+buttonW && my >= resetY && my < resetY+buttonH {
			g.reset()
			return
		}
	}
	if inpututil.IsKeyJustPressed(ebiten.KeyEscape) {
		g.reset()
		return
	}

	// Chord option hover and selection
	if len(g.options) > 0 {
		totalW := len(g.options)*optionW + (len(g.options)-1)*optionGap
		startX := (screenW - totalW) / 2

		for i := range g.options {
			ox := startX + i*(optionW+optionGap)
			if mx >= ox && mx < ox+optionW && my >= optionY && my < optionY+optionH {
				g.hovered = i
				break
			}
		}

		if inpututil.IsMouseButtonJustPressed(ebiten.MouseButtonLeft) && g.hovered >= 0 {
			g.selectOption(g.hovered)
			return
		}

		keys := []ebiten.Key{ebiten.Key1, ebiten.Key2, ebiten.Key3, ebiten.Key4, ebiten.Key5}
		for i, k := range keys {
			if i < len(g.options) && inpututil.IsKeyJustPressed(k) {
				g.selectOption(i)
				return
			}
		}
	}

	// BPM
	if inpututil.IsKeyJustPressed(ebiten.KeyUp) {
		g.bpm = math.Min(g.bpm+10, 240)
	}
	if inpututil.IsKeyJustPressed(ebiten.KeyDown) {
		g.bpm = math.Max(g.bpm-10, 40)
	}
}

func (g *Game) selectOption(idx int) {
	if idx < 0 || idx >= len(g.options) {
		return
	}
	chosen := g.options[idx].To
	if len(g.bars) < g.nextBar+1 {
		g.bars = append(g.bars, Bar{ChordFunc: chosen, Chosen: true})
	}
	g.nextBar++
	g.refreshOptions()
}

func (g *Game) Draw(screen *ebiten.Image) {
	screen.Fill(bgColor)

	switch g.state {
	case StateTitle:
		g.drawTitle(screen)
	case StatePlaying:
		g.drawPlaying(screen)
	}
}

func (g *Game) drawTitle(screen *ebiten.Image) {
	ebitenutil.DebugPrintAt(screen, "CHORD COMPOSITION", screenW/2-70, 40)
	ebitenutil.DebugPrintAt(screen, "Real-Time Jazz Harmony", screenW/2-80, 60)

	// Instructions
	instructions := []string{
		"Bars scroll left at a steady tempo. Before each bar crosses",
		"the bar line, choose the next chord (keys 1-5 or click).",
		"If you don't choose in time, the current chord is held.",
	}
	for i, line := range instructions {
		ebitenutil.DebugPrintAt(screen, line, screenW/2-200, 100+i*16)
	}

	// BPM setting
	ebitenutil.DebugPrintAt(screen, fmt.Sprintf("BPM: %.0f  (Up/Down to adjust)", g.bpm), screenW/2-100, 170)

	// Play button
	bx := float32((screenW - buttonW) / 2)
	by := float32(200)
	vector.DrawFilledRect(screen, bx, by, float32(buttonW), float32(buttonH), buttonColor, false)

	mx, my := ebiten.CursorPosition()
	if mx >= int(bx) && mx < int(bx)+buttonW && my >= int(by) && my < int(by)+buttonH {
		vector.DrawFilledRect(screen, bx, by, float32(buttonW), float32(buttonH), hoveredOverlay, false)
	}
	ebitenutil.DebugPrintAt(screen, "PLAY", int(bx)+62, int(by)+18)

	ebitenutil.DebugPrintAt(screen, "Press ENTER, SPACE, or click PLAY", screenW/2-120, 265)
}

func (g *Game) drawPlaying(screen *ebiten.Image) {
	g.drawHeader(screen)
	g.drawResetButton(screen)
	g.drawBarTimeline(screen)
	g.drawBarLine(screen)
	g.drawOptions(screen)
	g.drawHelp(screen)
}

func (g *Game) drawHeader(screen *ebiten.Image) {
	keyName := noteNames[g.keyRoot]
	header := fmt.Sprintf("Key: %s Major    BPM: %.0f", keyName, g.bpm)
	ebitenutil.DebugPrintAt(screen, header, 20, 15)
	ebitenutil.DebugPrintAt(screen, fmt.Sprintf("Bar: %d", len(g.bars)), screenW/2-20, 15)
}

func (g *Game) drawResetButton(screen *ebiten.Image) {
	rx := float32(resetX)
	ry := float32(resetY)
	vector.DrawFilledRect(screen, rx, ry, float32(buttonW), float32(buttonH), resetColor, false)

	mx, my := ebiten.CursorPosition()
	if mx >= resetX && mx < resetX+buttonW && my >= resetY && my < resetY+buttonH {
		vector.DrawFilledRect(screen, rx, ry, float32(buttonW), float32(buttonH), hoveredOverlay, false)
	}
	ebitenutil.DebugPrintAt(screen, "RESET (Esc)", resetX+30, resetY+18)
}

func (g *Game) drawBarTimeline(screen *ebiten.Image) {
	for i, bar := range g.bars {
		x := g.barXPosition(i)
		if x+float64(barWidthPx) < 0 || x > float64(screenW) {
			continue
		}

		currentBarIdx := int(g.scrollX)
		c := barColor
		if i == currentBarIdx {
			c = activeBarColor
		}
		vector.DrawFilledRect(screen, float32(x), float32(barY), float32(barWidthPx-4), float32(barHeightPx), c, false)

		name := ChordName(g.keyRoot, bar.ChordFunc)
		label := ChordLabel(bar.ChordFunc)
		ebitenutil.DebugPrintAt(screen, name, int(x)+10, barY+10)
		ebitenutil.DebugPrintAt(screen, "("+label+")", int(x)+10, barY+28)

		if !bar.Chosen && i > 0 {
			ebitenutil.DebugPrintAt(screen, "(held)", int(x)+10, barY+44)
		}
	}

	// Pending "???" bar
	pendX := g.barXPosition(len(g.bars))
	if pendX < float64(screenW) && pendX+float64(barWidthPx) > 0 {
		vector.DrawFilledRect(screen, float32(pendX), float32(barY), float32(barWidthPx-4), float32(barHeightPx), pendingBarColor, false)
		ebitenutil.DebugPrintAt(screen, "???", int(pendX)+10, barY+10)
	}

	// Arrow connectors
	totalBars := len(g.bars) + 1
	for i := 0; i < totalBars-1; i++ {
		x := g.barXPosition(i)
		arrowX := x + float64(barWidthPx-4)
		if arrowX > 0 && arrowX < float64(screenW)-20 {
			ebitenutil.DebugPrintAt(screen, "->", int(arrowX)+2, barY+22)
		}
	}
}

func (g *Game) drawBarLine(screen *ebiten.Image) {
	x := float32(barLineX)
	frac := g.scrollX - math.Floor(g.scrollX)
	alpha := uint8(120)
	if frac > 0.8 {
		pulse := (frac - 0.8) / 0.2
		alpha = uint8(120 + pulse*135)
	}
	lc := color.RGBA{R: barLineColor.R, G: barLineColor.G, B: barLineColor.B, A: alpha}
	vector.DrawFilledRect(screen, x, float32(barY-20), 3, float32(barHeightPx+40), lc, false)
	ebitenutil.DebugPrintAt(screen, "bar line", int(x)-20, barY-35)
}

func (g *Game) drawOptions(screen *ebiten.Image) {
	if len(g.options) == 0 {
		return
	}

	pendX := g.barXPosition(len(g.bars))
	distToLine := pendX - float64(barLineX)
	urgent := distToLine < float64(barWidthPx)

	prompt := "Choose next chord:  (keys 1-5 or click)"
	if urgent {
		prompt = ">> Choose now! <<  (keys 1-5 or click)"
	}
	ebitenutil.DebugPrintAt(screen, prompt, screenW/2-140, optionY-25)

	totalW := len(g.options)*optionW + (len(g.options)-1)*optionGap
	startX := (screenW - totalW) / 2

	for i, tr := range g.options {
		ox := float32(startX + i*(optionW+optionGap))

		ci := i % len(optionColors)
		c := optionColors[ci]
		vector.DrawFilledRect(screen, ox, float32(optionY), float32(optionW), float32(optionH), c, false)

		if g.hovered == i {
			vector.DrawFilledRect(screen, ox, float32(optionY), float32(optionW), float32(optionH), hoveredOverlay, false)
		}

		name := ChordName(g.keyRoot, tr.To)
		funcLabel := ChordLabel(tr.To)
		numKey := fmt.Sprintf("[%d]", i+1)
		ebitenutil.DebugPrintAt(screen, numKey+" "+name, int(ox)+8, optionY+8)
		ebitenutil.DebugPrintAt(screen, "("+funcLabel+")", int(ox)+8, optionY+24)

		dots := ""
		for d := 0; d < tr.Weight; d++ {
			dots += "*"
		}
		ebitenutil.DebugPrintAt(screen, dots, int(ox)+8, optionY+38)
	}
}

func (g *Game) drawHelp(screen *ebiten.Image) {
	ebitenutil.DebugPrintAt(screen, "Up/Down: BPM  |  1-5: select chord  |  Click: select  |  Esc: reset", 20, screenH-25)
}

func (g *Game) Layout(outsideWidth, outsideHeight int) (int, int) {
	return screenW, screenH
}

func main() {
	ebiten.SetWindowSize(screenW, screenH)
	ebiten.SetWindowTitle("Chord Composition Game")
	if err := ebiten.RunGame(NewGame()); err != nil {
		log.Fatal(err)
	}
}

// tests go here; this will not be compiled when this package is used as an extension.
// =====================
// Strategic Sound Stacking
// =====================
function soundStacking(soundType: string) {
    switch (soundType) {
        case "Level-Up":
            RetroSounds[0].play()
            pause(40)
            playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle16), 120, 80, 1100)
            break
        case "Enemy-Defeated":
            RetroSounds[13].play()
            pause(30)
            playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle32), 120, 120, 300)
            break
        case "Rare-Item":
            RetroSounds[16].play()
            pause(60)
            playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle16), 200, 100, 1000)
            break
        case "Puzzle-Solved":
            RetroSounds[25].play()
            pause(50)
            RetroSounds[20].play()
            break
        case "Ability-Unlock":
            RetroSounds[18].play()
            pause(40)
            playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle16), 100, 80, 1100)
            break
        default:
            break
    }
}
// =====================
// Pitch-Scaled Dynamic Sounds
// =====================
function playDash(speed: number) {
    pitch = Math.constrain(600 + speed * 2, 600, 950)
    playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle32), 100, 200, pitch)
}
function playLowHealth(hp: number, maxHp: number) {
    ratio = hp / maxHp
    pitch5 = Math.map(ratio * 100, 0, 100, 180, 350)
    playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle16), 200, 120, pitch5)
}
function playCharge(charge: number, maxCharge: number) {
    pitch4 = Math.map(charge, 0, maxCharge, 300, 900)
    playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle32), 80, 150, pitch4)
}
function playDistancePing(distance: number, maxDist: number) {
    pitch6 = Math.map(distance, 0, maxDist, 900, 300)
    playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle32), 60, 120, pitch6)
}
function playEnemyHit(combo: number) {
    pitch3 = Math.constrain(350 + combo * 60, 350, 1200)
    playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle32), 80, 200, pitch3)
}
// =====================
// Volume + Duration Jitter
// =====================
function playSoundWithVariation(wave: number, duration: number, volume: number, pitch: number) {
    vol = Math.constrain(volume + randint(-10, 10), 20, 255)
    dur = Math.constrain(duration + randint(-20, 20), 20, 1000)
    pitch = quantizePitch(jitterPitch(pitch, 15))
    soundEffects.createSound(wave, dur, vol, pitch).play()
}
function playJump(force: number) {
    pitch2 = Math.constrain(500 + force * 3, 500, 800)
    playSoundWithVariation(soundEffects.waveNumber(WaveType.Cycle32), 80, 120, pitch2)
}
let pitch2 = 0
let dur = 0
let vol = 0
let pitch3 = 0
let pitch6 = 0
let pitch4 = 0
let pitch5 = 0
let ratio = 0
let pitch = 0
scene.setBackgroundColor(12)
let RetroMenu = Retro.UI.Menu.createMenu(["a", "b", "c", "d", "e", "f", "G"], [], scene.screenWidth() / 8, scene.screenHeight() / 2, 160, 50)
// Define your custom arrow images
const customUpArrow = img`
    . . . . . . 6 6 . . . . . .
    . . . . . 6 6 6 6 . . . . .
    . . . . 6 6 6 6 6 6 . . . .
    . . . 6 6 6 6 6 6 6 6 . . .
`
const customDownArrow = img`
    . . . 8 8 8 8 8 8 8 8 . . .
    . . . . 8 8 8 8 8 8 . . . .
    . . . . . 8 8 8 8 . . . . .
    . . . . . . 8 8 . . . . . .
`
Retro.UI.Menu.setMenuArrows(RetroMenu, customUpArrow, customDownArrow)
// =====================
// Retro Sound Table
// =====================
let RetroSounds = [
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 1000, 80, 440),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 1000, 80, 100),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 500, 250, 300, 250, 0),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 1000, 200, 600),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 200, 80, 600),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 200, 200, 80),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 80, 120, 700),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 120, 120, 300),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 40, 80, 600),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 100, 200, 900),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 150, 120, 500, 800),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 80, 200, 200),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 120, 200, 150),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 300, 180, 400, 100),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 90, 200, 900),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 100, 100, 1200),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 400, 600, 800, 700),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 300, 120, 800),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 500, 100, 400, 900),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 150, 200, 120),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 600, 120, 500, 1000),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 200, 150, 300, 500),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 400, 120, 200, 700),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 150, 180, 600),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 80, 200, 400),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 120, 100, 800),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 200, 150, 500, 600),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 300, 200, 200),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 80, 220, 120),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 300, 120, 250),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 400, 200, 500, 80),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 120, 160, 700),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 200, 220, 350),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 80, 200, 200),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 300, 80, 1200, 200),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 60, 100, 700),
    soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 40, 120, 900)
]
function quantizePitch(pitch: number, step = 50): number {
    return Math.round(pitch / step) * step
}
function jitterPitch(pitch: number, amount = 15): number {
    return pitch + randint(-amount, amount)
}
let soundeffect: SoundBuffer
Retro.screenFlash(500, 800)
soundeffect = RetroSounds._pickRandom()
soundeffect.play()

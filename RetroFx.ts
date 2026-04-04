namespace SpriteKind {
    //% isKind
    export const UI = SpriteKind.create()
}
//% weight=100 color=#ff9500 icon="\uf109" block="Retro Fx+" groups=['Sound','Dynamic','Variation','Retro FX','Effects','Movement','Platformer','AI','Juice','UI','Game','Input','Utility', 'Dialog', 'Menu']
namespace Retro {
    
    export namespace UI {

        export class Menu {
            private RetroMenu: Sprite = null
            private upArrow: Sprite = null
            private downArrow: Sprite = null
            private selectedIndex: number = 0
            private totalItems: number = 0
            private visibleItems: number = 0
            private scrollOffset: number = 0
            static openMenus: Menu[] = []

            constructor(options: string[], callbacks: (() => void)[], x: number, y: number, dimensionX: number, dimensionY: number, title: string) {
                // Create miniMenu items
                let items: miniMenu.MenuItem[] = []
                for (let value of options) items.push(miniMenu.createMenuItem(value))

                // Create the miniMenu
                this.RetroMenu = miniMenu.createMenuFromArray(items)
                this.RetroMenu.setPosition(x, y)
                miniMenu.setTitle(this.RetroMenu, title)
                miniMenu.setDimensions(this.RetroMenu, dimensionX, dimensionY)
                // Register button callback
                miniMenu.onButtonPressed(this.RetroMenu, miniMenu.Button.A, (selection, index) => {
                    Retro.playRetroSound(Sounds.MenuSelect)
                    if (callbacks[index]) callbacks[index]()
                })
                this.totalItems = options.length
                this.visibleItems = 3 // tweak if needed based on height
                this.visibleItems = Math.idiv(this.RetroMenu.height, 13)
                miniMenu.onSelectionChanged(this.RetroMenu, (selection, index) => {
                    this.selectedIndex = index

                    // Scroll up
                    if (this.selectedIndex < this.scrollOffset) {
                        this.scrollOffset = this.selectedIndex
                    }

                    // Scroll down 
                    if (this.selectedIndex > this.scrollOffset + this.visibleItems - 1) {
                        this.scrollOffset = this.selectedIndex - (this.visibleItems - 1)
                    }

                    Retro.playRetroSound(Sounds.CursorMove)
                })


                // Optional: add open menu tracking
                Menu.openMenus.push(this)
            }

            destroy() {
                miniMenu.close(this.RetroMenu)
                const idx = Menu.openMenus.indexOf(this)
                if (idx >= 0) Menu.openMenus.splice(idx, 1)
                if (this.upArrow) {
                    this.upArrow.destroy()
                    this.upArrow = null
                }

                if (this.downArrow) {
                    this.downArrow.destroy()
                    this.downArrow = null
                }
            }
            /**
             * Create a Retro Menu 
             * @param options the text options in your Retro Menu 
             * @param callbacks any callback function needed in the Retro Menu
             * @param x x position 
             * @param y y position
             * @param dimensionX the width of the Retro Menu 
             * @param dimensionY the height of the Retro Menu
             */
            //% block
            //% blockId=retro_menu
            //% weight=86
            //% group=Menu
            //% subcategory="UI Fx"
            //% blockSetVariable=retroMenu
            //% callbacks.shadow=lists_create_with
            //% x.defl=80 y.defl=60
            //% dimensionX.defl=80 dimensionY.defl=60
            //% help=retrofx/docs/create-menu
            static createMenu(options: string[], callbacks: (() => void)[], x: number, y: number, dimensionX: number, dimensionY: number, title: string) {
                return new Menu(options, callbacks, x, y, dimensionX, dimensionY, title)
            }
            
            
            static isAnyMenuOpen(): boolean {
                return Menu.openMenus.length > 0
            }
            private createArrows(upImg: Image, downImg: Image) {
                this.upArrow = sprites.create(upImg, SpriteKind.UI)
                this.downArrow = sprites.create(downImg, SpriteKind.UI)

                this.upArrow.setFlag(SpriteFlag.Ghost, true)
                this.downArrow.setFlag(SpriteFlag.Ghost, true)

                this.updateArrowPositions()
                this.animateArrows()
            }
            private animateArrows() {
                game.onUpdate(() => {
                    if (!this.upArrow || !this.downArrow) return

                    let t = game.runtime() / 200

                    this.upArrow.y += Math.sin(t) * 0.3
                    this.downArrow.y += Math.sin(t) * 0.3

                    // Visibility logic
                    this.upArrow.setFlag(SpriteFlag.Invisible, this.scrollOffset <= 0)

                    this.downArrow.setFlag(
                        SpriteFlag.Invisible,
                        this.scrollOffset + this.visibleItems >= this.totalItems
                    )
                })
            }
            private updateArrowPositions() {
                let x = this.RetroMenu.x
                let y = this.RetroMenu.y
                let halfHeight = this.RetroMenu.height / 2

                // Place arrows OUTSIDE the menu
                this.upArrow.setPosition(x, y - halfHeight - 8)
                this.downArrow.setPosition(x, y + halfHeight + 8)
            }
            /**
             * Set custom scroll arrows for menu
             */
            //% block="set menu $menu scroll arrows up $up down $down"
            //% blockId=retro_menu_arrows
            //% group=Menu
            //% subcategory="UI Fx"
            //% weight=85
            static setMenuArrows(menu: Menu, up: Image, down: Image) {
                menu.createArrows(up, down)
            }
        }

        export class Dialog {
            private lines: string[]
            private current: number
            private box: Sprite
            private text: TextSprite

            constructor(lines: string[], x: number, y: number) {
                this.lines = lines
                this.current = 0
                this.box = sprites.create(img`
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                `, SpriteKind.UI)
                this.box.setPosition(x, y)
                this.text = textsprite.create(lines[0])
            }

            // Show next line of dialog
            next() {
                this.current++
                if (this.current >= this.lines.length) {
                    this.destroy()
                } else {
                    this.text.setText(this.lines[this.current])
                }
            }

            // Destroy the dialog box
            destroy() {
                if (this.box) {
                    this.box.destroy()
                    this.box = null
                    this.text.destroy()
                    this.text = null
                }
            }

            /**
             * Create Retro dialog
             * @param lines the text for the game to read
             * @param x x position 
             * @param y y position
             */
            //% block="create dialog with text $lines at x $x y $y"
            //% blockId=retro_dialog_create
            //% weight=88
            //% group=Dialog
            //% subcategory="UI Fx"
            //% blockSetVariable=retroDialog
            //% lines.shadow=lists_create_with
            //% x.defl=80 y.defl=60
            static create(lines: string[], x: number, y: number): Dialog {
                return new Dialog(lines, x, y)
            }
        }

    }

    /**
     * Retro sound effects available in the library
     */
    export enum Sounds {
        //% block="level up"
        LevelUp,
        //% block="hurt"
        Hurt,
        //% block="power charged"
        PowerCharged,
        //% block="charging"
        Charging,
        //% block="jump"
        Jump,
        //% block="break block"
        BreakBlock,
        //% block="menu select"
        MenuSelect,
        //% block="menu back"
        MenuBack,
        //% block="cursor move"
        CursorMove,
        //% block="dash"
        Dash,
        //% block="double jump"
        DoubleJump,
        //% block="land"
        Land,
        //% block="enemy hit"
        EnemyHit,
        //% block="enemy defeated"
        EnemyDefeated,
        //% block="shield parry"
        ShieldParry,
        //% block="coin"
        Coin,
        //% block="rare item"
        RareItem,
        //% block="key obtained"
        KeyObtained,
        //% block="ability unlocked"
        AbilityUnlocked,
        //% block="error"
        Error,
        //% block="puzzle solved"
        PuzzleSolved,
        //% block="door open"
        DoorOpen,
        //% block="hidden passage"
        HiddenPassage,
        //% block="platform appears"
        PlatformAppears,
        //% block="switch toggled"
        SwitchToggled,
        //% block="logic tick"
        LogicTick,
        //% block="partial solution"
        PartialSolution,
        //% block="puzzle reset"
        PuzzleReset,
        //% block="environment damage"
        EnvDamage,
        //% block="low health pulse"
        LowHealthPulse,
        //% block="falling void"
        FallingVoid,
        //% block="wall jump"
        WallJump,
        //% block="slide"
        Slide,
        //% block="air dash end"
        AirDashEnd,
        //% block="teleport"
        Teleport,
        //% block="text box"
        TextBox,
        //% block="npc chirp"
        NPCChirp
    }

    export enum SoundCombos {

        //% block="level up combo"
        LevelUp,

        //% block="rare item combo"
        RareItem,

        //% block="enemy defeated combo"
        EnemyDefeated,

        //% block="puzzle solved combo"
        PuzzleSolved
    }

    export enum Effects {

        // UI / Menu
        //% block="menu select"
        MenuSelect,

        //% block="menu move"
        MenuMove,

        //% block="menu open"
        MenuOpen,

        //% block="menu close"
        MenuClose,


        // Combat / Action
        //% block="hit spark"
        HitSpark,

        //% block="heavy hit impact"
        HeavyHit,

        //% block="critical hit burst"
        CriticalHit,

        //% block="enemy death burst"
        EnemyDeath,


        // Movement
        //% block="jump burst"
        JumpBurst,

        //% block="dash trail"
        DashTrail,

        //% block="land impact"
        LandImpact,

        //% block="wall impact"
        WallImpact,


        // Power / Magic
        //% block="charge glow"
        ChargeGlow,

        //% block="power up burst"
        PowerUp,

        //% block="level up burst"
        LevelUpBurst,

        //% block="ability unlock flash"
        AbilityUnlock,


        // Items
        //% block="coin burst"
        CoinBurst,

        //% block="rare item glow"
        RareItemGlow,

        //% block="key pickup burst"
        KeyPickup,


        // Environment
        //% block="explosion burst"
        Explosion,

        //% block="laser hit spark"
        LaserHit,

        //% block="teleport burst"
        TeleportBurst,

        //% block="door open effect"
        DoorOpen,


        // Puzzle / Logic
        //% block="puzzle solve burst"
        PuzzleSolve,

        //% block="switch toggle click"
        SwitchToggle,

        //% block="error glitch"
        ErrorGlitch,

        //% block="reset fade"
        ResetFade,


        // Screen FX
        //% block="light screen shake"
        ScreenShakeLight,

        //% block="heavy screen shake"
        ScreenShakeHeavy,

        //% block="screen flash"
        ScreenFlash,

        //% block="screen ripple"
        ScreenRipple,

        //% block="screen vignette"
        ScreenVignette,


        // Retro / Glitch
        //% block="glitch burst"
        GlitchBurst,

        //% block="pixel dissolve"
        PixelDissolve,

        //% block="scanline pop"
        ScanlinePop
    }
    // =====================
    // Retro Sound Table
    // =====================

    export const RetroSounds = [
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 1000, 80, 440), // Level-Up Base
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 1000, 80, 100), // Wrong answer / hurt
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 500, 250, 300, 250, 0), // Power charged
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 1000, 200, 600), // Charging up
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 200, 80, 600), // Jumping
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 200, 200, 80), // Hitting breakable block
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 80, 120, 700), // Menu select
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 120, 120, 300), // Menu back / cancel
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 40, 80, 600), // Cursor move
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 100, 200, 900), // Dash
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 150, 120, 500, 800), // Double jump
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 80, 200, 200), // Land
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 120, 200, 150), // Enemy hit
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 300, 180, 400, 100), // Enemy defeated
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 90, 200, 900), // Shield / parry
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 100, 100, 1200), // Coin
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 400, 600, 800, 700), // Rare item
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 300, 120, 800), // Key obtained
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 500, 100, 400, 900), // Ability unlocked
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 150, 200, 120), // Error / invalid
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 600, 120, 500, 1000), // Puzzle solved
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 200, 150, 300, 500), // Door open
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 400, 120, 200, 700), // Hidden passage
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 150, 180, 600), // Platform appears
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 80, 200, 400), // Switch toggled
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 120, 100, 800), // Correct logic tick
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 200, 150, 500, 600), // Partial solution
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 300, 200, 200), // Puzzle reset
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 80, 220, 120), // Env damage
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 300, 120, 250), // Low health pulse
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 400, 200, 500, 80), // Falling void
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 120, 160, 700), // Wall jump
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 200, 220, 350), // Slide
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 80, 200, 200), // Air dash end
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 300, 80, 1200, 200), // Teleport blip
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle16), 60, 100, 700), // Text box appear
        soundEffects.createSound(soundEffects.waveNumber(WaveType.Cycle32), 40, 120, 900) // NPC chirp
    ]

    export let ifPause = false
    export let inMenu: boolean = false
    // =====================
    // Basic Sound
    // =====================

    /**
     * Play a retro sound effect
     */
    //% block="play retro sound $sound"
    //% blockId=retro_play_sound
    //% group=Sound
    //% subcategory="Audio Fx"
    //% weight=100
    export function playRetroSound(sound: Sounds) {

        let s = RetroSounds[sound]

        if (!ifPause) {
            s.play()
        } else {
            s.playUntilDone()
        }

    }

    // =====================
    // Pitch Helpers
    // =====================

    /**
     * Quantize pitch to steps
     */
    //% block="quantize pitch $pitch step $step"
    //% blockId=retro_quantize_pitch
    //% subcategory="Utility"
    //% weight=40
    //% step.defl=50
    //% pitch.shadow=math_number
    export function quantizePitch(pitch: number, step: number): number {

        return Math.round(pitch / step) * step

    }



    /**
     * Play sound with envelope control (attack, decay, sustain, release)
     */
    //% block="play envelope sound start pitch $startPitch end pitch $endPitch||attack $attack decay $decay sustain $sustain release $release"
    //% blockId=retro_envelope_sound
    //% group="Sound"
    //% subcategory="Audio Fx"
    //% weight=93
    //% startPitch.defl=600
    //% endPitch.defl=400
    //% attack.defl=50
    //% decay.defl=50
    //% sustain.defl=180
    //% release.defl=100
    //% attack.shadow=math_number
    //% decay.shadow=math_number
    //% sustain.shadow=math_number
    //% release.shadow=math_number
    //% expandableArgumentMode="toggle"
    export function envelopeSound(
        startPitch: number,
        endPitch: number,
        attack?: number,
        decay?: number,
        sustain?: number,
        release?: number
    ) {

        let a = attack || 50
        let d = decay || 50
        let s = sustain || 180
        let r = release || 100

        let duration = a + d + r

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            duration,
            s,
            startPitch,
            endPitch
        ).play()
    }
    /**
    * Play a retro pitch sweep sound
    */
    //% block="play pitch sweep start $startPitch end $endPitch duration $duration ms"
    //% blockId=retro_pitch_sweep
    //% subcategory="Audio Fx"
    //% weight=92
    //% startPitch.defl=1200
    //% endPitch.defl=200
    //% duration.defl=120
    export function pitchSweep(startPitch: number, endPitch: number, duration: number) {

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            duration,
            200,
            startPitch,
            endPitch
        ).play()

    }
    /**
     * Play two retro sounds together
     */
    //% block="play sounds together $a and $b"
    //% blockId=retro_parallel_sounds
    //% group=Sound
    //% subcategory="Audio Fx"
    //% weight=91
    export function playSoundsTogether(a: Sounds, b: Sounds) {

        control.runInParallel(function () {
            RetroSounds[a].play()
        })

        control.runInParallel(function () {
            RetroSounds[b].play()
        })

    }
    /**
    * Play random sound from sound bank
    */
    //% block="play random sound from bank $sounds"
    //% blockId=retro_sound_bank
    //% group=Variation
    //% subcategory="System Fx"
    //% weight=89
    //% sounds.shadow="lists_create_with"
    export function playSoundBank(sounds: Sounds[]) {

        if (sounds.length <= 0) return

        let s = sounds._pickRandom()

        RetroSounds[s].play()

    }
    /**
     * Play random sound from bank with pitch variation
     */
    //% block="play sound bank $sounds pitch variation $variation"
    //% blockId=retro_sound_bank_var
    //% group=Variation
    //% subcategory="System Fx"
    //% weight=88
    //% sounds.shadow="lists_create_with"
    //% variation.defl=20
    export function playSoundBankVariation(sounds: Sounds[], variation: number) {

        if (sounds.length <= 0) return

        let s = RetroSounds[sounds[randint(0, sounds.length - 1)]]

        let pitch = jitterPitch(600, variation)

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            100,
            180,
            pitch
        ).play()

    }
    // =====================
    // Variation Sound
    // =====================

    /**
     * Play a sound with random variation
     */
    //% block="play variation pitch $pitch duration $duration volume $volume"
    //% blockId=retro_variation_sound
    //% group=Variation
    //% subcategory="System Fx"
    //% weight=80
    //% pitch.defl=600
    //% duration.defl=100
    //% volume.defl=120
    export function playSoundWithVariation(pitch: number, duration: number, volume: number) {

        let vol = Math.constrain(volume + randint(-10, 10), 20, 255)
        let dur = Math.constrain(duration + randint(-20, 20), 20, 1000)

        pitch = quantizePitch(jitterPitch(pitch, 15), 50)

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            dur,
            vol,
            pitch
        ).play()

    }
    /**
     * Run an action with a probability chance
     */
    //% block="with $chance % chance do"
    //% blockId=retro_probability_event
    //% group=Variation
    //% subcategory="System Fx"
    //% weight=98
    //% chance.min=0 chance.max=100
    //% chance.defl=50
    //% handlerStatement
    export function probabilityEvent(chance: number, handler: () => void) {

        if (randint(1, 100) <= chance) {
            handler()
        }

    }
    /**
     * Get variation value based on velocity
     */
    //% block="velocity variation from $velocity min $min max $max"
    //% blockId=retro_velocity_variation
    //% subcategory="System Fx"
    //% group=Variation
    //% weight=97
    //% velocity.defl=50
    //% min.defl=0
    //% max.defl=100
    export function velocityVariation(
        velocity: number,
        min: number,
        max: number
    ): number {

        let v = Math.abs(velocity)

        return Math.clamp(min, max, v)

    }
    /**
     * Pick random value from variation table
     */
    //% block="variation from table $values"
    //% blockId=retro_variation_table
    //% group=Variation
    //% subcategory="System Fx"
    //% weight=96
    //% values.shadow="lists_create_with"
    export function variationTable(values: number[]): number {

        if (values.length == 0) return 0

        return values[randint(0, values.length - 1)]

    }
    // =====================
    // Dynamic Sounds
    // =====================

    /**
     * Play a dash sound based on speed
     */
    //% block="play dash sound speed $speed"
    //% blockId=retro_dash_sound
    //% group=Dynamic
    //% subcategory="System Fx"
    //% weight=70
    //% speed.defl=100
    export function playDash(speed: number) {

        let pitch = Math.constrain(600 + speed * 2, 600, 950)
        playSoundWithVariation(pitch, 100, 200)

    }


    /**
     * Play a jump sound based on force
     */
    //% block="play jump sound force $force"
    //% blockId=retro_jump_sound
    //% group=Dynamic
    //% subcategory="System Fx"
    //% weight=69
    //% force.defl=50
    export function playJump(force: number) {

        let pitch = Math.constrain(500 + force * 3, 500, 800)
        playSoundWithVariation(pitch, 80, 120)

    }


    /**
     * Play enemy hit combo sound
     */
    //% block="play enemy hit combo $combo"
    //% blockId=retro_enemy_hit
    //% group=Dynamic
    //% subcategory="System Fx"
    //% weight=68
    //% combo.defl=1
    export function playEnemyHit(combo: number) {

        let pitch = Math.constrain(350 + combo * 60, 350, 1200)
        playSoundWithVariation(pitch, 80, 200)

    }


    /**
     * Play charging sound
     */
    //% block="play charge sound charge $charge max $maxCharge"
    //% blockId=retro_charge_sound
    //% group=Dynamic
    //% subcategory="System Fx"
    //% weight=67
    //% charge.defl=0
    //% maxCharge.defl=100
    export function playCharge(charge: number, maxCharge: number) {

        let pitch = Math.map(charge, 0, maxCharge, 300, 900)
        playSoundWithVariation(pitch, 80, 150)

    }

    /**
     * Follow sprite with camera lag
     */
    //% block="camera follow $sprite lag $lag"
    //% blockId=retro_camera_follow_lag
    //% subcategory="Effects"
    //% weight=84
    //% lag.defl=4
    //% sprite.shadow=variables_get
    //% sprite.defl=Player
    export function cameraFollowLag(sprite: Sprite, lag: number) {

        game.onUpdate(function () {

            scene.centerCameraAt(
                scene.cameraProperty(CameraProperty.X) + (sprite.x - scene.cameraProperty(CameraProperty.X)) / lag,
                scene.cameraProperty(CameraProperty.Y) + (sprite.y - scene.cameraProperty(CameraProperty.Y)) / lag
            )

        })

    }
    /**
     * Camera punch for hits or impacts
    */
    //% block="camera punch for $sprite intensity $intensity duration $duration ms"
    //% blockId=retro_camera_punch
    //% group=Effect
    //% subcategory="Visiual Fx"
    //% intensity.defl=4
    //% duration.defl=60
    //% sprite.shadow=variables_get
    //% sprite.defl=Object
    export function cameraPunch(sprite: Sprite, intensity: number, duration: number) {
        let startX = scene.cameraProperty(CameraProperty.X)
        let startY = scene.cameraProperty(CameraProperty.Y)
        let endX = startX + randint(-intensity, intensity)
        let endY = startY + randint(-intensity, intensity)
        scene.centerCameraAt(endX, endY)
        pause(duration)
        scene.centerCameraAt(startX, startY)
    }

    /**
     * Play a random retro sound
     */
    //% block="play random retro sound"
    //% blockId=retro_random_sound
    //% group=Audio
    //% subcategory="Audio Fx"
    //% weight=95
    export function playRandomSound() {

        let s = RetroSounds[randint(0, RetroSounds.length - 1)]
        s.play()

    }
    /**
    * Coyote jump (jump shortly after leaving platform)
    */
    //% block="coyote jump force $force"
    //% blockId=retro_coyote_jump
    //% group=Movement
    //% subcategory="Juice Fx"
    //% force.defl=50
    //% sprite.shadow=variables_get sprite.defl=Player
    let canCoyoteJump = false
    export function coyoteJump(sprite: Sprite, force: number) {
        game.onUpdate(function () {
            if (!sprite.isHittingTile(CollisionDirection.Bottom)) canCoyoteJump = true
            else canCoyoteJump = false
        })
        if (sprite.isHittingTile(CollisionDirection.Bottom) || canCoyoteJump) {
            sprite.vy = -force
        }
    }
    /**
     * Float control for a sprite
     */
    //% group=Movement
    //% subcategory="Juice Fx"
    //% block="float movement %sprite factor %value"
    //% blockId=retro_float_control
    //% sprite.shadow=variables_get sprite.defl=Player
    //% value.defl=200
    export function floatControl(sprite: Sprite, value: number) { }
    /**
    * Input buffer for queued actions
    */
    //% block="input buffer handler %handler buffer $bufferTime ms"
    //% blockId=retro_input_buffer
    //% group=Input
    //% subcategory="System Fx"
    //% bufferTime.defl=200
    let inputQueue: (() => void)[] = []
    export function inputBuffer(handler: () => void, bufferTime: number) {
        inputQueue.push(handler)
        pause(bufferTime)
        while (inputQueue.length > 0) inputQueue.shift()()
    }
    /**
    * Screen vignette effect
    */
    //% block="screen vignette intensity $intensity"
    //% blockId=retro_screen_vignette
    //% group=
    //% subcategory="Camera Fx"
    //% intensity.defl=80
    export function screenVignette(intensity: number) {
        let rect = image.create(screen.width, screen.height)
        rect.fill(0)
        rect.drawRect(0, 0, screen.width, screen.height, intensity)
        scene.setBackgroundImage(rect)
    }
    //% block="set speed to $speed"
    //% group="HI"
    //% speed.shadow=math_number
    //% speed.defl=50
    //% speed.duplicateShadowOnDrag=true
    export function setSpeed(speed: number) { }
    /**
    * Pixel dissolve effect for sprite
    */
    //% block="pixel dissolve $sprite duration $duration ms"
    //% blockId=retro_pixel_dissolve
    //% subcategory="Effects"
    //% duration.defl=400
    //% sprite.shadow=variables_get
    //% sprite.defl=Entity
    export function pixelDissolve(sprite: Sprite, duration: number) {
        let imgCopy = sprite.image.clone()
        for (let i = 0; i < duration / 20; i++) {
            let x = randint(0, imgCopy.width - 1)
            let y = randint(0, imgCopy.height - 1)
            imgCopy.setPixel(x, y, 0)
            sprite.setImage(imgCopy)
            pause(20)
        }
        sprite.destroy()
    }
    /**
    * Play a retro sound with custom volume and pitch
    */
    //% block="play retro sound $sound volume $volume pitch $pitch"
    //% blockId=retro_custom_sound
    //% subcategory="Sound"
    //% weight=94
    //% volume.defl=120
    //% pitch.defl=600
    export function playCustomSound(sound: Sounds, volume: number, pitch: number) {

        let s = soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            100,
            volume,
            pitch
        )

        s.play()

    }

    
    
    /**
    * Loop a sound several times
    */
    //% block="loop retro sound $sound"
    //% blockId=retro_loop_sound
    //% subcategory="Utility"
    //% weight=80
    export function loopSound(sound: Sounds) {
        RetroSounds[sound].loop()
    }


    /**
    * Stop all playing sounds
    */
    //% block="stop retro sounds"
    //% blockId=retro_stop_sound
    //% subcategory="Utility"
    //% weight=79
    export function stopSounds() {
        music.stopAllSounds()
    }


    /**
    * Play two sounds in sequence
    */
    //% block="play sound sequence $first then $second"
    //% blockId=retro_sequence_sound
    //% subcategory="Utility"
    //% weight=78
    export function sequenceSounds(first: Sounds, second: Sounds) {
        RetroSounds[first].playUntilDone()
        RetroSounds[second].play()
    }

    /**
    * Play a sound based on a value range
    */
    //% block="reactive sound value $value min $min max $max"
    //% blockId=retro_reactive_sound
    //% subcategory="Dynamic"
    //% weight=70
    //% value.defl=50
    //% min.defl=0
    //% max.defl=100
    export function reactiveSound(value: number, min: number, max: number) {

        let pitch = Math.map(value, min, max, 300, 900)

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            80,
            150,
            pitch
        ).play()

    }

    /**
    * Set pause mode for sounds
    */
    //% block="set retro sound pause mode $state"
    //% blockId=retro_pause_toggle
    //% subcategory="Utility"
    //% weight=60
    export function setPauseMode(state: boolean) {
        ifPause = state
    }
    /**
     * Set the global volume 
     * @param volume the volume in which you want for all sound effects
    */
    //% block="set global retro volume $volume"
    //% volume.min=0 volume.max=255
    //% weight=90
    export function setGlobalVolume(volume: number) {
        music.setVolume(volume)
    }
    /**
    * Play preset retro sound combo
    */
    //% block="play retro combo $combo"
    //% blockId=retro_combo_sound
    //% subcategory="Combos"
    //% weight=85
    export function playCombo(combo: SoundCombos) {

        switch (combo) {

            case SoundCombos.LevelUp:
                RetroSounds[0].play()
                pause(40)
                RetroSounds[3].play()
                break

            case SoundCombos.RareItem:
                RetroSounds[16].play()
                pause(50)
                RetroSounds[15].play()
                break

            case SoundCombos.EnemyDefeated:
                RetroSounds[13].play()
                pause(30)
                RetroSounds[12].play()
                break

            case SoundCombos.PuzzleSolved:
                RetroSounds[20].play()
                pause(40)
                RetroSounds[25].play()
                break

        }

    }
    function createEffectPreset(effect: Effects): SpreadEffectData {

        switch (effect) {

            // ================= UI =================
            case Effects.MenuSelect:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 2, 3],
                    true,
                    [1, 2],
                    new extraEffects.NumberRange(10, 20),
                    new extraEffects.NumberRange(10, 20),
                    new extraEffects.NumberRange(100, 200),
                    0, -10,
                    new extraEffects.NumberRange(50, 100),
                    0, 0, null
                )

            case Effects.MenuMove:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 3],
                    true,
                    [1, 1],
                    new extraEffects.NumberRange(5, 10),
                    new extraEffects.NumberRange(5, 15),
                    new extraEffects.NumberRange(80, 120),
                    0, 0,
                    new extraEffects.NumberRange(20, 60),
                    0, 0, null
                )

            case Effects.MenuOpen:
                return extraEffects.createCustomSpreadEffectData(
                    [3, 4, 5],
                    true,
                    [1, 2, 3],
                    new extraEffects.NumberRange(20, 30),
                    new extraEffects.NumberRange(20, 40),
                    new extraEffects.NumberRange(150, 250),
                    0, -5,
                    new extraEffects.NumberRange(80, 120),
                    0, 0, null
                )

            case Effects.MenuClose:
                return extraEffects.createCustomSpreadEffectData(
                    [5, 4, 3],
                    true,
                    [2, 2, 1],
                    new extraEffects.NumberRange(20, 30),
                    new extraEffects.NumberRange(20, 40),
                    new extraEffects.NumberRange(150, 250),
                    0, 5,
                    new extraEffects.NumberRange(80, 120),
                    0, 0, null
                )

            // ================= COMBAT =================
            case Effects.HitSpark:
                return extraEffects.createCustomSpreadEffectData(
                    [7, 6, 5],
                    true,
                    [1, 2],
                    new extraEffects.NumberRange(20, 40),
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(80, 150),
                    0, 0,
                    new extraEffects.NumberRange(80, 140),
                    0, 0, null
                )

            case Effects.HeavyHit:
                return extraEffects.createCustomSpreadEffectData(
                    [7, 6, 2],
                    false,
                    [2, 3, 4],
                    new extraEffects.NumberRange(40, 70),
                    new extraEffects.NumberRange(60, 100),
                    new extraEffects.NumberRange(150, 250),
                    0, -10,
                    new extraEffects.NumberRange(120, 180),
                    0, 0, null
                )

            case Effects.Explosion:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 4, 7, 5],
                    false,
                    [2, 4, 6],
                    new extraEffects.NumberRange(60, 100),
                    new extraEffects.NumberRange(80, 150),
                    new extraEffects.NumberRange(200, 400),
                    0, 0,
                    new extraEffects.NumberRange(150, 220),
                    20, 0, 100
                )

            case Effects.CriticalHit:
                return extraEffects.createCustomSpreadEffectData(
                    [7, 7, 6, 5],
                    true,
                    [2, 3, 5],
                    new extraEffects.NumberRange(50, 80),
                    new extraEffects.NumberRange(80, 120),
                    new extraEffects.NumberRange(200, 300),
                    0, -5,
                    new extraEffects.NumberRange(150, 220),
                    0, 0, 40
                )

            case Effects.EnemyDeath:
                return extraEffects.createCustomSpreadEffectData(
                    [6, 5, 3, 1],
                    false,
                    [2, 3, 4],
                    new extraEffects.NumberRange(60, 100),
                    new extraEffects.NumberRange(100, 160),
                    new extraEffects.NumberRange(250, 400),
                    0, -10,
                    new extraEffects.NumberRange(180, 260),
                    0, 0, 80
                )

            // ================= MOVEMENT =================
            case Effects.JumpBurst:
                return extraEffects.createCustomSpreadEffectData(
                    [3, 2, 1],
                    true,
                    [1, 1, 2],
                    new extraEffects.NumberRange(10, 25),
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(120, 180),
                    0, -20,
                    new extraEffects.NumberRange(60, 120),
                    -5, 0, null
                )

            case Effects.LandImpact:
                return extraEffects.createCustomSpreadEffectData(
                    [5, 4, 3],
                    false,
                    [2, 3],
                    new extraEffects.NumberRange(30, 50),
                    new extraEffects.NumberRange(40, 80),
                    new extraEffects.NumberRange(120, 200),
                    0, 10,
                    new extraEffects.NumberRange(80, 140),
                    10, 0, null
                )

            case Effects.DashTrail:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 2, 3],
                    true,
                    [1, 1, 1],
                    new extraEffects.NumberRange(5, 15),
                    new extraEffects.NumberRange(10, 30),
                    new extraEffects.NumberRange(60, 120),
                    0, 0,
                    new extraEffects.NumberRange(30, 80),
                    0, 0, null
                )

            case Effects.WallImpact:
                return extraEffects.createCustomSpreadEffectData(
                    [4, 3, 2],
                    false,
                    [2, 3],
                    new extraEffects.NumberRange(40, 70),
                    new extraEffects.NumberRange(60, 100),
                    new extraEffects.NumberRange(150, 250),
                    0, 0,
                    new extraEffects.NumberRange(120, 180),
                    10, 0, null
                )

            // ================= POWER / MAGIC =================
            case Effects.ChargeGlow:
                return extraEffects.createCustomSpreadEffectData(
                    [3, 4, 5],
                    true,
                    [1, 2, 3],
                    new extraEffects.NumberRange(20, 40),
                    new extraEffects.NumberRange(50, 100),
                    new extraEffects.NumberRange(150, 250),
                    0, 0,
                    new extraEffects.NumberRange(200, 300),
                    0, 0, null
                )

            case Effects.PowerUp:
                return extraEffects.createCustomSpreadEffectData(
                    [3, 5, 7],
                    true,
                    [2, 3, 4],
                    new extraEffects.NumberRange(40, 80),
                    new extraEffects.NumberRange(80, 140),
                    new extraEffects.NumberRange(200, 350),
                    0, -15,
                    new extraEffects.NumberRange(180, 260),
                    0, 0, 60
                )

            case Effects.LevelUpBurst:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 4, 6, 7],
                    false,
                    [2, 4, 6],
                    new extraEffects.NumberRange(60, 120),
                    new extraEffects.NumberRange(100, 180),
                    new extraEffects.NumberRange(250, 400),
                    0, -20,
                    new extraEffects.NumberRange(220, 320),
                    0, 0, 100
                )

            case Effects.AbilityUnlock:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 3, 5, 7],
                    true,
                    [1, 2, 3],
                    new extraEffects.NumberRange(50, 100),
                    new extraEffects.NumberRange(80, 150),
                    new extraEffects.NumberRange(200, 350),
                    0, 0,
                    new extraEffects.NumberRange(250, 350),
                    0, 0, 80
                )

            // ================= ITEMS =================
            case Effects.CoinBurst:
                return extraEffects.createCustomSpreadEffectData(
                    [5, 6, 7],
                    true,
                    [1, 2],
                    new extraEffects.NumberRange(10, 30),
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(100, 180),
                    0, -10,
                    new extraEffects.NumberRange(80, 140),
                    0, 0, null
                )

            case Effects.RareItemGlow:
                return extraEffects.createCustomSpreadEffectData(
                    [3, 5, 7],
                    true,
                    [2, 3, 4],
                    new extraEffects.NumberRange(40, 80),
                    new extraEffects.NumberRange(80, 140),
                    new extraEffects.NumberRange(200, 350),
                    0, 0,
                    new extraEffects.NumberRange(300, 400),
                    0, 0, 100
                )

            case Effects.KeyPickup:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 4, 6],
                    true,
                    [1, 2],
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(60, 120),
                    new extraEffects.NumberRange(150, 250),
                    0, -5,
                    new extraEffects.NumberRange(180, 260),
                    0, 0, null
                )

            // ================= ENVIRONMENT =================
            case Effects.LaserHit:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 2, 7],
                    false,
                    [2, 3],
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(80, 140),
                    new extraEffects.NumberRange(150, 300),
                    0, 0,
                    new extraEffects.NumberRange(200, 300),
                    0, 0, 60
                )

            case Effects.TeleportBurst:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 3, 5, 7],
                    false,
                    [2, 4, 6],
                    new extraEffects.NumberRange(50, 100),
                    new extraEffects.NumberRange(100, 180),
                    new extraEffects.NumberRange(250, 400),
                    0, 0,
                    new extraEffects.NumberRange(300, 400),
                    0, 0, 100
                )

            case Effects.DoorOpen:
                return extraEffects.createCustomSpreadEffectData(
                    [4, 5, 6],
                    true,
                    [1, 2],
                    new extraEffects.NumberRange(20, 50),
                    new extraEffects.NumberRange(40, 100),
                    new extraEffects.NumberRange(120, 220),
                    0, 0,
                    new extraEffects.NumberRange(150, 220),
                    0, 0, null
                )

            // ================= PUZZLE / LOGIC =================
            case Effects.PuzzleSolve:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 3, 5],
                    true,
                    [1, 2, 3],
                    new extraEffects.NumberRange(40, 80),
                    new extraEffects.NumberRange(80, 140),
                    new extraEffects.NumberRange(180, 300),
                    0, -10,
                    new extraEffects.NumberRange(220, 300),
                    0, 0, 80
                )

            case Effects.SwitchToggle:
                return extraEffects.createCustomSpreadEffectData(
                    [3, 4],
                    true,
                    [1, 1],
                    new extraEffects.NumberRange(20, 40),
                    new extraEffects.NumberRange(40, 80),
                    new extraEffects.NumberRange(120, 200),
                    0, 0,
                    new extraEffects.NumberRange(120, 180),
                    0, 0, null
                )

            case Effects.ErrorGlitch:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 1, 7, 3],
                    false,
                    [1, 3, 5],
                    new extraEffects.NumberRange(50, 100),
                    new extraEffects.NumberRange(80, 160),
                    new extraEffects.NumberRange(200, 350),
                    10, -10,
                    new extraEffects.NumberRange(200, 320),
                    0, 10, 120
                )

            case Effects.ResetFade:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 2],
                    false,
                    [1, 2],
                    new extraEffects.NumberRange(60, 120),
                    new extraEffects.NumberRange(100, 200),
                    new extraEffects.NumberRange(250, 400),
                    0, 0,
                    new extraEffects.NumberRange(300, 400),
                    0, 0, 150
                )

            // ================= SCREEN FX =================
            case Effects.ScreenShakeLight:
                return extraEffects.createCustomSpreadEffectData(
                    [1],
                    false,
                    [1],
                    new extraEffects.NumberRange(10, 20),
                    new extraEffects.NumberRange(20, 40),
                    new extraEffects.NumberRange(80, 120),
                    0, 0,
                    new extraEffects.NumberRange(50, 100),
                    2, 0, null
                )

            case Effects.ScreenShakeHeavy:
                return extraEffects.createCustomSpreadEffectData(
                    [1],
                    false,
                    [2],
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(80, 120),
                    new extraEffects.NumberRange(200, 300),
                    0, 0,
                    new extraEffects.NumberRange(120, 200),
                    6, 0, null
                )

            case Effects.ScreenFlash:
                return extraEffects.createCustomSpreadEffectData(
                    [7],
                    false,
                    [3],
                    new extraEffects.NumberRange(5, 10),
                    new extraEffects.NumberRange(10, 20),
                    new extraEffects.NumberRange(50, 100),
                    0, 0,
                    new extraEffects.NumberRange(30, 80),
                    0, 0, null
                )

            case Effects.ScreenRipple:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 3, 4],
                    false,
                    [2, 3],
                    new extraEffects.NumberRange(40, 80),
                    new extraEffects.NumberRange(80, 140),
                    new extraEffects.NumberRange(200, 300),
                    0, 0,
                    new extraEffects.NumberRange(200, 300),
                    0, 0, 80
                )

            case Effects.ScreenVignette:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 2],
                    false,
                    [1],
                    new extraEffects.NumberRange(80, 140),
                    new extraEffects.NumberRange(120, 200),
                    new extraEffects.NumberRange(250, 400),
                    0, 0,
                    new extraEffects.NumberRange(300, 400),
                    0, 0, 120
                )

            // ================= RETRO / MISC =================
            case Effects.PixelDissolve:
                return extraEffects.createCustomSpreadEffectData(
                    [1, 2, 3, 7],
                    false,
                    [2, 3, 5],
                    new extraEffects.NumberRange(60, 120),
                    new extraEffects.NumberRange(100, 180),
                    new extraEffects.NumberRange(250, 400),
                    0, 0,
                    new extraEffects.NumberRange(250, 350),
                    0, 0, 100
                )

            case Effects.ScanlinePop:
                return extraEffects.createCustomSpreadEffectData(
                    [2, 3, 4],
                    true,
                    [1, 2],
                    new extraEffects.NumberRange(30, 60),
                    new extraEffects.NumberRange(60, 120),
                    new extraEffects.NumberRange(150, 250),
                    0, 0,
                    new extraEffects.NumberRange(180, 260),
                    0, 0, null
                )
        }

        return extraEffects.createCustomSpreadEffectData(
            [0],
            true,
            [1],
            new extraEffects.NumberRange(10, 10),
            new extraEffects.NumberRange(10, 10),
            new extraEffects.NumberRange(50, 50),
            0, 0,
            new extraEffects.NumberRange(100, 100),
            0, 0, 50
        )
    }
    /**
     * Play an Retro ParticleEffect
     */
    //% block="play effect $effect at x $x y $y"
    //% blockId=retro_particles
    //% subcategory="Retro Fx"
    export function playEffect(effect: Effects, x: number, y: number) {
        let data = createEffectPreset(effect)
        extraEffects.createSpreadEffectAt(data, x, y)
    }
    /**
     * Plays a retro 8-bit explosion sound.
     * @param power how strong the explosion is
     * @param pitch optional pitch override
     * @param duration optional duration
     */
    //% block="play 8-bit explosion power %power||pitch %pitch duration %duration"
    //% blockId=retro_explosion
    //% subcategory="Retro FX"
    //% weight=100
    //% power.defl=5
    //% pitch.defl=200
    //% duration.defl=300
    //% pitch.shadow="math_number"
    //% duration.shadow="math_number"
    //% expandableArgumentMode="toggle"
    export function playExplosion(power: number, pitch?: number, duration?: number) {

        let p = pitch || 200
        let d = duration || 300

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.TunableNoise),
            d,
            Math.constrain(power * 40, 40, 255),
            p
        ).play()

    }
    /**
    * Add trail effect to sprite
    */
    //% block="add trail to $sprite image $img interval $interval ms"
    //% blockId=retro_trail_effect
    //% subcategory="Retro FX"
    //% weight=96
    //% interval.defl=50
    export function trailEffect(sprite: Sprite, img: Image, interval: number) {

        game.onUpdateInterval(interval, function () {

            let t = sprites.create(img, SpriteKind.Food)

            t.setPosition(sprite.x, sprite.y)

            t.lifespan = 200

        })

    }
    /**
    * Screen ripple effect
    */
    //% block="screen ripple strength $strength duration $duration ms"
    //% blockId=retro_screen_ripple
    //% subcategory="Retro FX"
    //% weight=99
    //% strength.defl=3
    //% duration.defl=200
    export function screenRipple(strength: number, duration: number) {

        let start = game.runtime()

        while (game.runtime() - start < duration) {

            scene.cameraShake(strength, 50)

            pause(50)

        }

    }
    /**
     * Flash the screen with a color transition
    */
    //% block="screen flash to white for $duration,pause for $pauseTime"
    //% blockId=retro_screen_flash
    //% subcategory="Retro FX"
    //% weight=100
    //% duration.defl=120
    export function screenFlash(pauseTime: number, duration: number) {

        color.FadeToWhite.startScreenEffect(duration)
        color.pauseUntilFadeDone()
        timer.after(pauseTime, () => color.startFade(color.currentPalette(), color.originalPalette, duration))



    }
    /**
    * Plays a retro laser or blaster sound.
    * @param intensity power of the laser
    * @param startPitch starting pitch
    * @param endPitch ending pitch
    */
    //% block="play laser intensity %intensity||start pitch %startPitch end pitch %endPitch"
    //% blockId=retro_laser
    //% subcategory="Retro FX"
    //% weight=99
    //% intensity.defl=4
    //% startPitch.defl=1200
    //% endPitch.defl=300
    //% startPitch.shadow="math_number"
    //% endPitch.shadow="math_number"
    //% expandableArgumentMode="toggle"
    export function playLaser(intensity: number, startPitch?: number, endPitch?: number) {

        let sp = startPitch || 1200
        let ep = endPitch || 300

        soundEffects.createSound(
            soundEffects.waveNumber(WaveType.Cycle32),
            120,
            Math.constrain(intensity * 40, 40, 255),
            sp,
            ep
        ).play()

    }
    /**
    * Plays a retro coin cascade sound.
    * @param coins number of coins
    * @param startPitch starting pitch
    */
    //% block="play coin cascade coins %coins||start pitch %startPitch"
    //% blockId=retro_coin_cascade
    //% subcategory="Retro FX"
    //% weight=98
    //% coins.defl=5
    //% startPitch.defl=800
    //% startPitch.shadow="math_number"
    //% expandableArgumentMode="toggle"
    export function coinCascade(coins: number, startPitch?: number) {

        let pitch = startPitch || 800

        for (let i = 0; i < coins; i++) {

            soundEffects.createSound(
                soundEffects.waveNumber(WaveType.Cycle32),
                60,
                150,
                pitch + i * 120
            ).play()

            pause(40)

        }

    }
    /**
     * Plays a retro glitch sound effect.
     * @param intensity glitch intensity
     * @param bursts number of glitch bursts
     */
    //% block="play glitch intensity %intensity||bursts %bursts"
    //% blockId=retro_glitch
    //% subcategory="Retro FX"
    //% weight=97
    //% intensity.defl=5
    //% bursts.defl=4
    //% bursts.shadow="math_number"
    //% expandableArgumentMode="toggle"
    export function playGlitch(intensity: number, bursts?: number) {

        let b = bursts || 4

        for (let i = 0; i < b; i++) {

            soundEffects.createSound(
                soundEffects.waveNumber(WaveType.TunableNoise),
                40,
                Math.constrain(intensity * 30, 30, 255),
                randint(100, 1200)
            ).play()

            pause(30)

        }

    }
    /**
     * Plays a retro console startup jingle.
     * @param pitch base pitch
     * @param speed delay between notes
     */
    //% block="play retro startup jingle||base pitch %pitch speed %speed"
    //% blockId=retro_startup
    //% subcategory="Retro FX"
    //% weight=96
    //% pitch.defl=400
    //% speed.defl=80
    //% pitch.shadow="math_number"
    //% speed.shadow="math_number"
    //% expandableArgumentMode="toggle"
    export function startupJingle(pitch?: number, speed?: number) {

        let p = pitch || 400
        let s = speed || 80

        let notes = [p, p + 200, p + 350, p + 500]

        for (let i = 0; i < notes.length; i++) {

            soundEffects.createSound(
                soundEffects.waveNumber(WaveType.Cycle32),
                120,
                180,
                notes[i]
            ).play()

            pause(s)

        }

    }
    /**
     * Shake the screen for impact effects
     */
    //% block="screen shake strength $strength duration $time ms"
    //% blockId=retro_screen_shake
    //% subcategory="Effects"
    //% weight=90
    //% strength.defl=4
    //% strength.min=0 strength.max=8
    //% time.defl=200
    export function screenShake(strength: number, time: number) {

        scene.cameraShake(strength, time)

    }
    /**
     * Parallax camera for background layer
     */
    //% block="parallax camera layer $layer factor $factor"
    //% blockId=retro_parallax_camera
    //% subcategory="Effects"
    //% factor.defl=3
    //% layer.shadow=variables_get
    //% layer.defl=Layer
    export function parallaxCamera(layer: Sprite, factor: number) {
        game.onUpdate(function () {
            let camX = scene.cameraProperty(CameraProperty.X)
            let camY = scene.cameraProperty(CameraProperty.Y)
            layer.x = camX / factor
            layer.y = camY / factor
        })
    }
    /**
    * Flash a sprite to show damage or power
    */
    //% block="flash sprite $sprite times $times||interval $interval"
    //% blockId=retro_flash_sprite
    //% subcategory="Effects"
    //% weight=89
    //% times.defl=4
    //% interval.defl=80
    //% expandableArgumentMode="toggle"
    //% sprite.shadow=variables_get
    //% sprite.defl=Player
    export function flashSprite(sprite: Sprite, times: number, interval?: number) {

        let t = interval || 80

        for (let i = 0; i < times; i++) {

            sprite.setFlag(SpriteFlag.Invisible, true)
            pause(t)

            sprite.setFlag(SpriteFlag.Invisible, false)
            pause(t)

        }

    }
    /**
    * Enable screen wrap for a sprite
    */
    //% block="enable screen wrap for $sprite"
    //% blockId=retro_screen_wrap
    //% subcategory="Movement"
    //% weight=85
    //% sprite.shadow=variables_get
    //% sprite.defl=Object
    export function screenWrap(sprite: Sprite) {

        game.onUpdate(function () {

            if (sprite.x < 0) sprite.x = screen.width
            if (sprite.x > screen.width) sprite.x = 0
            if (sprite.y < 0) sprite.y = screen.height
            if (sprite.y > screen.height) sprite.y = 0

        })

    }
    /**
     * Dash a sprite instantly
     */
    //% block="dash $sprite by vx $vx vy $vy"
    //% blockId=retro_dash_sprite
    //% subcategory="Movement"
    //% weight=84
    //% vx.defl=50
    //% vy.defl=0
    //% sprite.shadow=variables_get
    //% sprite.defl=Player

    export function dash(sprite: Sprite, vx: number, vy: number) {

        sprite.vx += vx
        sprite.vy += vy

    }
    export let dashEnabledSprites: Sprite[] = []

    /**
     * Enable dash ability for a sprite
     */
    //% block="enable dash for $sprite speed $speed"
    //% blockId=retro_enable_dash
    //% subcategory="Movement"
    //% weight=82
    //% speed.defl=80
    //% sprite.shadow=variables_get
    //% sprite.defl=Object
    export function enableDash(sprite: Sprite, speed: number) {

        dashEnabledSprites.push(sprite)

        controller.B.onEvent(ControllerButtonEvent.Pressed, function () {

            if (dashEnabledSprites.indexOf(sprite) >= 0) {

                sprite.vx += speed * Math.sign(sprite.vx || 1)
                playDash(speed)

            }

        })

    }
    /**
    * Dash with cooldown
    */
    //% block="dash $sprite speed $speed cooldown $cooldown ms"
    //% blockId=retro_dash_cooldown
    //% subcategory="Movement"
    //% weight=81
    //% speed.defl=100
    //% cooldown.defl=500
    //% sprite.shadow=variables_get
    //% sprite.defl=Player
    export function dashCooldown(sprite: Sprite, speed: number, cooldown: number) {
        sprite.vx += speed
        pause(cooldown)

    }
    /**
     * Teleport sprite to position
     */
    //% block="teleport $sprite to x $x y $y"
    //% blockId=retro_teleport_sprite
    //% subcategory="Movement"
    //% weight=80
    //% sprite.shadow=variables_get
    //% sprite.defl=Object
    export function teleportSprite(sprite: Sprite, x: number, y: number) {

        sprite.setPosition(x, y)
        playRetroSound(Sounds.Teleport)

    }
    /**
     * Freeze game briefly
     */
    //% block="freeze frame $time ms"
    //% blockId=retro_freeze_frame
    //% subcategory="Effects"
    //% weight=88
    //% time.defl=60
    export function freezeFrame(time: number) {

        game.eventContext().deltaTimeMillis = 0
        pause(time)

    }
    
    export let combo = 0

    /**
     * Increase combo
     */
    //% block="increase combo"
    //% blockId=retro_increase_combo
    //% subcategory="Combos"
    //% weight=78
    export function increaseCombo() {

        combo++
        playEnemyHit(combo)

    }
    //% block="reset combo"
    //% blockId=retro_reset_combo
    //% subcategory="Combos"
    //% weight=77
    export function resetCombo() {
        combo = 0
    }
    /**
     * Show floating text
     */
    //% block="floating text $text at $sprite"
    //% blockId=retro_floating_text
    //% group=Dialog
    //% subcategory="UI"
    //% weight=86
    export function floatingText(text: string, sprite: Sprite) {
        let t = textsprite.create(text)
        t.setPosition(sprite.x, sprite.y - 10)
        t.lifespan = 800

    }
    /**
    * Typewriter text effect
    */
    //% block="typewriter text $text pause per letter $pausePerCharacter at x $x y $y|| destroy after $destroyAfter"
    //% blockId=retro_type_writer
    //% group=Dialog
    //% subcategory="UI"
    //% expandableArgumentMode="toggle"
    //% pausePerCharacter.shadow=timePicker
    //% x.defl=80
    //% y.defl=60
    //% destroyAfter.shadow=timePicker
    //% weight=97
    export function typewriterText(text: string, pausePerCharacter: number, x: number, y: number, destroyAfter?: number) {

        let t = fancyText.create("")
        t.setPosition(x, y)

        let current = ""

        for (let i = 0; i < text.length; i++) {
            current += text.charAt(i)
            t.setText(current)
            pause(pausePerCharacter)
        }
        if (destroyAfter) {
            timer.after(destroyAfter, () => t.destroy())
        }

    }
    /**
     * Knock a sprite backward
     */
    //% block="knockback $sprite vx $vx vy $vy"
    //% blockId=retro_knockback
    //% subcategory="Movement"
    //% weight=83
    //% vx.defl=-50
    //% vy.defl=-30
    //% sprite.shadow=variables_get
    //% sprite.defl=Entity
    export function knockback(sprite: Sprite, vx: number, vy: number) {

        sprite.vx = vx
        sprite.vy = vy

    }
    /**
     * Smart knockback based on velocity
    */
    //% block="smart knockback $sprite vx $vx vy $vy"
    //% blockId=retro_smart_knockback
    //% subcategory="Movement"
    //% vx.defl=-50
    //% vy.defl=-30
    //% sprite.shadow=variables_get
    //% sprite.defl=Object
    export function smartKnockback(sprite: Sprite, vx: number, vy: number) {
        sprite.vx += vx * Math.sign(sprite.vx || 1)
        sprite.vy += vy
    }
    /**
     * Impact sparks effect
     * @param x position X
     * @param y position Y 
     * @param count amount of times to enable the effect
     * @param t how long for the effect to last 
     * @param particlesPerSecond how many particles every second 
     * @param d the diamter of the effect
     */
    //% block="impact sparks x $x y $y count $count for $t || amount of particles $particlesPerSecond | diamter $d"
    //% blockId=retro_impact_sparks
    //% subcategory="Effects"
    //% count.defl=6
    //% expandableArgumentMode="enabled"
    //% t.shadow=timePicker
    //% t.defl=500
    //% particlesPerSecond.defl=8
    //% d.defl=50
    //% x.defl=80
    //% y.defl=60
    //% count.defl=5
    export function impactSparks(x: number, y: number, count: number, t: number, particlesPerSecond?: number, d?: number) {
        for (let i = 0; i < count; i++) {
            let impactEffect = extraEffects.createCustomSpreadEffectData([1, 1, 1, 1], false, [1, 1, 2, 2, 4, 4], extraEffects.createPercentageRange(0, 20), extraEffects.createPercentageRange(75, 120), extraEffects.createTimeRange(500, 1000))
            impactEffect.decelerateAfterDuration = 1250
            extraEffects.createSpreadEffectAt(impactEffect, x, y, t, particlesPerSecond, d)
        }
    }
    /**
    * Start a countdown timer
    */
    //% block="countdown $seconds seconds"
    //% blockId=retro_countdown
    //% subcategory="Game"
    //% weight=79
    //% seconds.defl=10
    export function countdown(seconds: number) {

        info.startCountdown(seconds)

    }
    /**
     * Detect button hold
     */
    //% block="on A button held $time ms"
    //% blockId=retro_button_hold
    //% subcategory="Input"
    //% weight=75
    //% time.defl=500
    export function onButtonHeld(time: number, handler: () => void) {

        controller.A.onEvent(ControllerButtonEvent.Pressed, function () {

            pause(time)

            if (controller.A.isPressed()) {
                handler()
            }

        })

    }
    /**
     * Retro hit impact
     */
    //% block="retro hit impact strength $shake freeze $freeze"
    //% blockId=retro_hit_impact
    //% subcategory="Effects"
    //% weight=95
    export function retroHitImpact(shake: number, freeze: number) {

        scene.cameraShake(shake, freeze)
        pause(freeze)

    }
    /**
    * Add random pitch variation
    */
    //% block="jitter pitch $pitch amount $amount"
    //% blockId=retro_jitter_pitch
    //% subcategory="Utility"
    //% weight=39
    //% amount.defl=15
    export function jitterPitch(pitch: number, amount: number): number {

        return pitch + randint(-amount, amount)

    }
    /**
     * Retro dialog text
     */
    //% block="retro dialog $text at x $x y $y"
    //% blockId=retro_retro_dialog
    //% group="Dialog"
    //% subcategory="UI"
    //% x.defl=80
    //% y.defl=40
    export function retroDialog(text: string, x: number, y: number) {
        let t = textsprite.create(text)
        t.setPosition(x, y)
        t.setMaxFontHeight(8)
        t.lifespan = 2000
    }
}

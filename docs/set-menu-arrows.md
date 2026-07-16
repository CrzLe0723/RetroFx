
# Set Menu Arrows

Adds custom scroll arrows to a Retro menu.

## Parameters

- **menu**: the menu to modify
- **up**: image used for the up arrow
- **down**: image used for the down arrow

## Example



```sig
Retro.UI.Menu.setMenuArrows(menu, img`
    . . 1 . .
    . 1 1 1 .
    1 1 1 1 1
`, img`
    1 1 1 1 1
    . 1 1 1 .
    . . 1 . .
`)
```

```blocks
let RetroMenu = Retro.UI.Menu.createMenu(["a", "b", "c", "d", "e", "f", "G"], [], scene.screenWidth() / 8, scene.screenHeight() / 2, 160, 50, "HI")
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

```

```package
retro-fx=github:CrzLe0723/RetroFx
```
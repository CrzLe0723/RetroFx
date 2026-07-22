
# Set Menu Arrows

Adds custom scroll arrows to a Retro menu.
```sig
Retro.UI.Menu.setMenuArrows(menu, img``, img``)
```

## Parameters

- **menu**: the menu to modify
- **up**: image used for the up arrow
- **down**: image used for the down arrow

## Example




```blocks
let RetroMenu = Retro.UI.Menu.createMenu(["a", "b", "c", "d", "e", "f", "G"], [], scene.screenWidth() / 8, scene.screenHeight() / 2, 160, 50, "HI")

let customUpArrow = img`
    . . . . . . 6 6 . . . . . .
    . . . . . 6 6 6 6 . . . . .
    . . . . 6 6 6 6 6 6 . . . .
    . . . 6 6 6 6 6 6 6 6 . . .
`
let customDownArrow = img`
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
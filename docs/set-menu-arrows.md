
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
let menu = Retro.UI.Menu.createMenu()
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

```package
retro-fx=github:CrzLe0723/RetroFx
```
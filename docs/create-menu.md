# Create Menu

Creates a Retro styled menu with selectable options.

## Parameters

- **options**: list of text options shown in the menu
- **callbacks**: list of functions that run when each option is selected
- **x**: horizontal position of the menu
- **y**: vertical position of the menu
- **dimensionX**: width of the menu
- **dimensionY**: height of the menu

## Example

```sig
let menu = Retro.UI.Menu.createMenu(
    ["Start", "Options", "Quit"],
    [() => {}, () => {}, () => {}],
    80,
    60,
    80,
    60
)

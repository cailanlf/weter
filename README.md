# Weter 
A terminal rendering engine written in TypeScript. Basic proof of concept to 
learn more about behaviour around terminal rendering before potentially working
on a native terminal emulator. 

This repository currently contains an example web application in SvelteKit that
is coupled with the library itself. At a certain completion point, the webapp
will be removed leaving only the library.

## Todo
- Cursor movement
- Text styling (color, font properties)
- ANSI sequences
  - Screen manipulation
  - Cursor manipulation
  - Style manipulation

- (?) pty emulation (eg. cooked input, interrupt handling)

## Usage
As stated above, currently the library is tightly coupled to the SvelteKit application.
If you wish to run the application, clone the repository to your machine and run
```sh
npm install
npm run dev
```

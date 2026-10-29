# Theme Color Guide

## Core Palette

| Color Name | Hex | RGB | Purpose / Mapping | 
| ----- | ----- | ----- | ----- | 
| Deep Lilac | \`#624cab\` | \`98, 76, 171\` | Primary Main | 
| Cornflower Blue | \`#7189ff\` | \`113, 137, 255\` | Primary Light / Hover Focus | 
| Wisteria Blue | \`#758ecd\` | \`117, 142, 205\` | Secondary Main | 
| Icy Blue | \`#a0ddff\` | \`160, 221, 255\` | Secondary Light | 
| Periwinkle | \`#c1cefe\` | \`193, 206, 254\` | Secondary Dark | 

## System Modes

### Light Mode

* **Background Default:** \`#fafafa\`
* **Background Paper:** \`#ffffff\`
* **Text Primary:** \`rgba(0, 0, 0, 0.87)\`
* **Text Secondary:** \`rgba(0, 0, 0, 0.6)\`

### Dark Mode

* **Background Default:** \`#121212\`
* **Background Paper:** \`#1e1e1e\`
* **Text Primary:** \`#ffffff\`
* **Text Secondary:** \`rgba(255, 255, 255, 0.7)\`

## Implementation Notes

* Mapped system preference autodetection upon initial execution (\`window.matchMedia\`).
* Sustained global accessibility using dynamic contrast text handling mapped per mode.
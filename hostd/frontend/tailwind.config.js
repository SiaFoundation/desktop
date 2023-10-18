const { join } = require('path')

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,dialogs,hooks,contexts}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
  ],
  presets: [require('@siafoundation/design-system/src/config/theme.js')],
}

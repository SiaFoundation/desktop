const { join } = require('path')

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,dialogs,hooks,contexts}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    'node_modules/@siafoundation/design-system/**/*.js',
  ],
  presets: [require('@siafoundation/design-system/theme.js')],
}

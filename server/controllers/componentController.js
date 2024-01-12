const db = require('../models/dbModel');

const addComponents = async (req, res, next) => {
  const { componentsStr } = req.body;
  const components = JSON.parse(componentsStr);
  const designId = res.locals.designId;
  console.log(components);

  const root = components[0];

  try {
    components[0].id = await db
      .query(
        'INSERT INTO components (design_id, name, z_index, props, styles, hooks) ' +
          'VALUES ($1, $2, $3, $4, $5, $6) ' +
          'RETURNING *;',
        [
          designId,
          root.name,
          root.z_index,
          JSON.stringify(root.props),
          JSON.stringify(root.styles),
          JSON.stringify(root.hooks),
        ]
      )
      .then((data) => data.rows[0]._id);

    const stack = [0];
    while (stack.length > 0) {
      const parentIndex = stack.pop();
      const parentId = components[parentIndex].id;
      const children = components.filter((item) => item.parent === parentId);
      const rows = children.map((item) => {
        const {
          name,
          x_position,
          y_position,
          z_index,
          props,
          styles,
          hooks,
          html_tag,
          inner_html,
        } = item;
        return [
          designId,
          parentId,
          name,
          x_position,
          y_position,
          z_index,
          html_tag,
          inner_html,
          ...[props, styles, hooks].map((item) => JSON.stringify(item)),
        ];
      });

      children.forEach(async (child, i) => {
        try {
          child.id = await db
            .query(
              'INSERT INTO components ' +
                '(design_id, parent_id, name, x_position, y_position, z_index, , html_tag, inner_html, props, styles, hooks) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ' +
                'RETURNING *;',
              rows[i]
            )
            .then((data) => data.rows[0]._id);
          stack.push(child.index);
        } catch (err) {
          throw err;
        }
      });
    }
    return next();
  } catch (err) {
    return next({
      log:
        'Express error handler caught componentController.addComponent middleware error' +
        err,
      message: { err: 'addComponent: ' + err },
    });
  }
};

const getComponents = (req, res, next) => {
  const designId = req.params.designId;
  return db
    .query('SELECT * FROM components WHERE design_id = $1;', [designId])
    .then((data) => (res.locals.components = data.rows))
    .then(() => next())
    .catch((err) =>
      next({
        log:
          'Express error handler caught componentController.getComponents middleware error' +
          err,
        message: { err: 'getComponents: ' + err },
      })
    );
};
module.exports = { addComponents, getComponents };

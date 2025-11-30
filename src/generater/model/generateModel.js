/**
 * モデルクラスの cast と fillable 設定テーブルを生成して表示
 *
 * @param {Array} columns
 */
export const generateModelClassAttributesTable = (columns) => {
  const $tableBody = $('#model-class-attributes-table-body');

  // 既存の行をクリア
  $tableBody.empty();

  // カラム情報をもとに行を追加
  columns.forEach((column) => {
    const $row = $('<tr></tr>');

    $row.append(`<td>${column.name}</td>`);
    $row.append(
      `<td><input type="text" class="column-cast-type" placeholder="例：integer"></input></td>`,
    );
    $row.append(
      `<td><input type="checkbox" class="column-fillable" title="fillable に含める"></td>`,
    );

    $tableBody.append($row);
  });
};

/**
 * モデルクラス内の cast と fillable 設定テンプレートを生成する
 *
 * @param {Array} columns - カラム情報の配列
 * @return {Object} モデルクラス内の cast と fillable 設定テンプレート
 */
export const generateModelClassAttributesTemplate = (columns) => {
  /**
   * モデルクラス内の cast と fillable 設定テンプレート
   */
  const casts = [];
  const fillables = [];

  const castTypes = $('.column-cast-type');
  const fillableChecks = $('.column-fillable');

  for (let i = 0; i < columns.length; i++) {
    const columnName = columns[i].name;
    const castType = castTypes[i].value;
    const isFillable = fillableChecks[i].checked;

    // cast テンプレート
    if (castType) {
      casts.push(`'${columnName}' => '${castType}',`);
    }

    // fillable テンプレート
    if (isFillable) {
      fillables.push(`'${columnName}',`);
    }
  }

  const castsTemplate = `protected $casts = [
  ${casts.join('\n  ')}
];`;
  const fillablesTemplate = `protected $fillable = [
  ${fillables.join('\n  ')}
];`;

  return {
    castsTemplate,
    fillablesTemplate,
  };
};

/**
 * 入力されたテーブル名を取得する
 *
 * @returns {string} 入力されたテーブル名
 */
export const getInputTableName = () => $('#table-name').val().trim();

/**
 * 入力されたテーブルのコメントを取得する
 */
export const getInputTableComment = () => $('#table-comment').val().trim();

/**
 * マイグレーションファイルを作成する artisan コマンドを生成する
 *
 * @param {string} tableName - テーブル名
 * @returns {string} マイグレーションファイルを作成する artisan コマンド
 */
export const generateMakeMigrationFileCommand = (tableName) =>
  `php artisan make:migration create_${tableName}_table --create=${tableName}`;

/**
 * マイグレーションファイル内のテーブル定義部分のテンプレートを生成する
 *
 * @param {string} tableComment - テーブルのコメント
 * @return {string} マイグレーションファイル内のテーブル定義テンプレート
 */
export const generateTableDefinitionTemplate = (tableComment) => {
  /**
   * マイグレーションファイル内のカラム定義テンプレート
   */
  const template = [];

  // テーブルコメント
  if (tableComment !== '') {
    template.push(`$table->comment('${tableComment}');`);
  }

  const culumnNames = $('.column-name');
  const culumnTypes = $('.column-data-type');
  const culumnLengths = $('.column-data-length');
  const culumnNullables = $('.column-nullable');
  const culumnDefaultValues = $('.column-default-value');
  const culumnComments = $('.column-comment');

  for (let i = 0; i < culumnNames.length; i++) {
    const name = culumnNames[i].value.trim();
    const type = culumnTypes[i].value;
    const length = culumnLengths[i].value.trim();
    const nullable = culumnNullables[i].checked;
    const defaultValue = culumnDefaultValues[i].value.trim();
    const comment = culumnComments[i].value.trim();

    if (!name) continue;

    let columnDefinition = `$table->${type}('${name}'${
      length ? `, ${length}` : ''
    })`;

    // NULL 許可
    if (nullable) columnDefinition += '->nullable()';

    // デフォルト値
    if (defaultValue) {
      switch (type) {
        case 'boolean':
        case 'integer':
        case 'bigInteger':
        case 'float':
        case 'double':
        case 'decimal':
          // リテラルとして扱う型
          columnDefinition += `->default(${defaultValue})`;
          break;
        default:
          // 文字列として扱う型
          columnDefinition += `->default('${defaultValue}')`;
      }
    }

    // カラムコメント
    if (comment) columnDefinition += `->comment('${comment}')`;

    columnDefinition += ';';
    template.push(columnDefinition);
  }

  // タイムスタンプ（created_at と updated_at カラム)
  template.push('$table->timestamps();');

  // ソフトデリート（deleted_at カラム)
  template.push('$table->softDeletes();');

  return template.join('\n');
};

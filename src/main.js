import {
  columns,
  getInputTableName,
  getInputTableComment,
  generateMakeMigrationFileCommand,
  generateTableDefinitionTemplate,
} from './generater/migration/generateTableDefinition.js';
import { copyToClipboard } from './generater/clipboard.js';

/**
 * テーブル名
 */
let tableName = '';
/**
 * テーブルコメント
 */
let tableComment = '';

$('#create-migration').on('click', () => {
  tableName = getInputTableName();
  tableComment = getInputTableComment();

  if (tableName === '') {
    alert('テーブル名を入力してください。');
    return;
  } else if (tableName.includes(' ')) {
    alert('テーブル名にスペースを含めることはできません。');
    return;
  }

  // マイグレーションファイルを作成するコマンドを生成して表示
  $('#make-migration-file-command').text(
    generateMakeMigrationFileCommand(tableName),
  );
  $('#make-migration-file-command-section').css('display', 'flex');
});

// マイグレーションファイルを作成するコマンドをクリップボードにコピー
$('#copy-make-migration-file-command').on('click', () => {
  const command = $('#make-migration-file-command').text();

  copyToClipboard(command);
  alert('コマンドをコピーしました。');
});

// カラムテーブルの行を 1 行追加
$('#add-column').on('click', () => {
  // 最初の行をコピー
  const $newRow = $('#columns-table-body tr').first().clone();

  // コピーした行の値をリセット
  $newRow.find('input').val('');
  $newRow.find('input[type="checkbox"]').prop('checked', false);
  $newRow.find('select').prop('selectedIndex', 0);

  // テーブルに追加
  $('#columns-table-body').append($newRow);
});

// 削除ボタンがクリックされた行を削除
$(document).on('click', '.remove-column', function () {
  if ($('#columns-table-body tr').length === 1) {
    return;
  }

  const $row = $(this).closest('tr');
  $row.remove();
});

// マイグレーションファイル内のカラム定義と削除テンプレートを生成して表示
$('#generate-table-definition-template').on('click', () => {
  const definitionTemplate = generateTableDefinitionTemplate(tableComment);
  const dropTemplate = `$table->dropIfExists('${tableName}');`;

  $('.table-definition-template-section').css('display', 'inline-block');
  $('#table-definition-template').text(definitionTemplate);
  $('#table-drop-template').text(dropTemplate);
});

// マイグレーションファイル内のカラム定義テンプレートをクリップボードにコピー
$('#copy-table-definition-template').on('click', () => {
  const template = $('#table-definition-template').text();
  copyToClipboard(template);
  alert('カラム定義テンプレートをコピーしました。');
});

// マイグレーションファイル内のカラム削除テンプレートをクリップボードにコピー
$('#copy-table-drop-template').on('click', () => {
  const template = $('#table-drop-template').text();
  copyToClipboard(template);
  alert('カラム削除テンプレートをコピーしました。');
});

import { pickerController } from "@ionic/vue";
import { ref } from "vue";

const selectedLang = ref("Hebrew");

const defaultColumnOptions = [["Hebrew", "Spanish", "Russian"]];

async function openPicker(
  numColumns = 1,
  numOptions = 3,
  columnOptions = defaultColumnOptions
) {
  const picker = await pickerController.create({
    columns: getColumns(numColumns, numOptions, columnOptions),
    buttons: [
      {
        text: "Cancel",
        role: "cancel"
      },
      {
        text: "Confirm",
        handler: value => {
          console.log(`Got Value ${value}`) + console.log(value["col-0"].text);
          selectedLang.value = value["col-0"].text;
        }
      }
    ]
  });

  await picker.present();
}

function getColumns(numColumns, numOptions, columnOptions) {
  let columns = [];
  for (let i = 0; i < numColumns; i++) {
    columns.push({
      name: `col-${i}`,
      options: getColumnOptions(i, numOptions, columnOptions)
    });
  }

  return columns;
}

function getColumnOptions(columnIndex, numOptions, columnOptions) {
  let options = [];
  for (let i = 0; i < numOptions; i++) {
    options.push({
      text: columnOptions[columnIndex][i % numOptions],
      value: i
    });
  }

  return options;
}

export { openPicker, selectedLang };

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {
//   const transformCommand = vscode.commands.registerCommand(
//     "transformToOptionalChain",
//     () => {
//       const editor = vscode.window.activeTextEditor;
//       if (editor) {
//         const selectedText = editor.document.getText(editor.selection);

//         editor.edit((builder) => {
//           builder.replace(editor.selection, selectedText.toUpperCase());
//         });
//       }
//       vscode.window.showInformationMessage("转换成功！");
//     }
//   );

//   context.subscriptions.push(transformCommand);

// Use the console to output diagnostic information (console.log) and errors (console.error)
// This line of code will only be executed once when your extension is activated
// console.log('Congratulations, your extension "auto-optional-chain-extension" is now active!');

// // The command has been defined in the package.json file
// // Now provide the implementation of the command with registerCommand
// // The commandId parameter must match the command field in package.json
// let disposable = vscode.commands.registerCommand('auto-optional-chain-extension.helloWorld', () => {
// 	// The code you place here will be executed every time your command is executed
// 	// Display a message box to the user
// 	vscode.window.showInformationMessage('Hello World from auto-optional-chain-extension!');
// });

// context.subscriptions.push(disposable);
// }

// This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from "vscode";
import * as babel from "@babel/core";
import type { NodePath, types } from "@babel/core";

function transform(code: string): string {
  function autoOptionalPlugin() {
    return {
      visitor: {
        MemberExpression(path: NodePath<types.MemberExpression>) {
          const text = path.toString();

          path.replaceWithSourceString(text.replace(/\./g, "?."));
        },
      },
    };
  }

  const res = babel.transformSync(code, {
    plugins: [autoOptionalPlugin],
  });

  return res?.code || "";
}

export function activate(context: vscode.ExtensionContext) {
  const transformCommand = vscode.commands.registerCommand(
    "transformToOptionalChain",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selectedText = editor.document.getText(editor.selection);

        if (!selectedText) {
          return;
        }

        editor.edit((builder) => {
          builder.replace(editor.selection, transform(selectedText));
        });
        vscode.window.showInformationMessage("转换成功！");
      }
    }
  );

  context.subscriptions.push(transformCommand);
}

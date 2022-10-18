import {EditorView, basicSetup} from "codemirror"
import {javascript,javascriptLanguage} from "@codemirror/lang-javascript"
import {keymap} from "@codemirror/view"
import {acceptCompletion,CompletionContext} from "@codemirror/autocomplete"
import {syntaxTree} from "@codemirror/language"

let tagOptions=[
  "banana","apple","grape",
].map((a)=>{return {label: "@"+a, type: "keyword"}})

function complete(context: CompletionContext) {
  let tree=syntaxTree(context.state)
  let nodeBefore = tree.resolveInner(context.pos, -1)
  
  

  let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
  let tagBefore = /@\w*$/.exec(textBefore)
  if (!tagBefore && !context.explicit) return null
  return {
    from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
    options: tagOptions,
    validFor: /^(@\w*)?$/
  }
}

const jsMyCompletions=javascriptLanguage.data.of({
  autocomplete: complete
})

let editor = new EditorView({
  extensions: [
    basicSetup,
    javascript(),
    jsMyCompletions,
    keymap.of([{ key: "Tab", run: acceptCompletion }]),
  ],
  parent: document.body
})
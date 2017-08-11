import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit, OnChanges {

  @Input() language: any;
  @Input() readOnly: Boolean;
  @Input() inputText: String;
  @Output() onEditorContentChange = new EventEmitter();

  options: any = {maxLines: 1000, printMargin: true, tabSize: 2};
  editorMode: any;
  editorText: String = "";

  launguageInfo: any = {
    c: {
          mode: 'c_cpp',
          template: `#include<stdio.h>

int main()
{
  printf("Hello World!");
  return 0;
}
`
        },
    cpp: {
      mode: 'c_cpp',
      template: `#include<iostream>
using namespace std;

int main()
{
  cout<<"Hello World!";
  return 0;
}
`
    },

    java: {
      mode: 'java',
      template:`/* IMPORTANT: The main class name should be 'TestClass' */

import java.util.*;

class TestClass {

    public static void main(String args[] ) throws Exception {

        System.out.println("Hello World!");

    }

}
`
    },

    python2: {
      mode: 'python',
      template:`print("Hello World!")`,
    },
    python3: {
      mode: 'python',
      template:`print("Hello World!")`,
    }
  }

  ngOnInit()
  {
    if (this.inputText) {
      this.editorText = this.inputText;
    } else {
      this.editorText = this.launguageInfo[this.language].template;
    }
    this.onEditorContentChange.emit(this.editorText);
    this.editorMode = this.launguageInfo[this.language].mode;
  }

  ngOnChanges(changes: any) {
    this.language = changes.language.currentValue;
    if (this.inputText) {
      this.editorText = this.inputText;
    } else {
      this.editorText = this.launguageInfo[this.language].template;
    }
    this.editorMode = this.launguageInfo[this.language].mode;
  }

  onChange(data) {
    this.onEditorContentChange.emit(data);
  }
}

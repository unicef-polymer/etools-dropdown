import {html} from 'lit-element';

// language=HTML
export const esmmSharedStyles = html` <style>
  *[hidden] {
    display: none !important;
  }

  :host {
    width: 242px;
    @apply --layout-horizontal;
    @apply --esmm-external-wrapper;
    --esmm-icons: {
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    --esmm-select-cursor: pointer;

    --paper-item-focused-before: {
      opacity: 0.06;
    }
    --paper-item-focused-after: {
      opacity: 0.06;
    }
  }

  :host(:not([readonly]):not([disabled])) {
    cursor: var(--esmm-select-cursor);
  }

  #dropdownMenu {
    position: var(--esmm-dropdown-menu-position, absolute) !important;
    display: flex;
    flex-direction: column;
    z-index: var(--esmm-dropdown-menu-z-index, initial);
  }

  #ironDrContent {
    background-color: var(--esmm-bg-color, #ffffff);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-height: 48px;
  }

  #optionsList {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 100vh !important;
  }

  .rounded {
    border-radius: 4px;
  }

  html {
    --paper-material: {
      display: block;
      position: relative;
    }
    --paper-material-elevation-1: {
      @apply --shadow-elevation-2dp;
    }
    --paper-material-elevation-2: {
      @apply --shadow-elevation-4dp;
    }
    --paper-material-elevation-3: {
      @apply --shadow-elevation-6dp;
    }
    --paper-material-elevation-4: {
      @apply --shadow-elevation-8dp;
    }
    --paper-material-elevation-5: {
      @apply --shadow-elevation-16dp;
    }
  }
  .paper-material {
    @apply --paper-material;
  }
  .paper-material[elevation='1'] {
    @apply --paper-material-elevation-1;
  }
  .paper-material[elevation='2'] {
    @apply --paper-material-elevation-2;
  }
  .paper-material[elevation='3'] {
    @apply --paper-material-elevation-3;
  }
  .paper-material[elevation='4'] {
    @apply --paper-material-elevation-4;
  }
  .paper-material[elevation='5'] {
    @apply --paper-material-elevation-5;
  }

  /* Duplicate the styles because of https://github.com/webcomponents/shadycss/issues/193 */
  :host {
    --paper-material: {
      display: block;
      position: relative;
    }
    --paper-material-elevation-1: {
      @apply --shadow-elevation-2dp;
    }
    --paper-material-elevation-2: {
      @apply --shadow-elevation-4dp;
    }
    --paper-material-elevation-3: {
      @apply --shadow-elevation-6dp;
    }
    --paper-material-elevation-4: {
      @apply --shadow-elevation-8dp;
    }
    --paper-material-elevation-5: {
      @apply --shadow-elevation-16dp;
    }
  }
  :host(.paper-material) {
    @apply --paper-material;
  }
  :host(.paper-material[elevation='1']) {
    @apply --paper-material-elevation-1;
  }
  :host(.paper-material[elevation='2']) {
    @apply --paper-material-elevation-2;
  }
  :host(.paper-material[elevation='3']) {
    @apply --paper-material-elevation-3;
  }
  :host(.paper-material[elevation='4']) {
    @apply --paper-material-elevation-4;
  }
  :host(.paper-material[elevation='5']) {
    @apply --paper-material-elevation-5;
  }
</style>`;

/* Content from /node_modules/tom-select/dist/css/tom-select.default.min.css */
export const tomSelectStyles = html` <style>
:root{--ts-pr-clear-button:0;--ts-pr-caret:0;--ts-pr-min:.75rem}.ts-wrapper.single .ts-control,.ts-wrapper.single .ts-control input{cursor:pointer}.ts-control{padding-right:max(var(--ts-pr-min),var(--ts-pr-clear-button) + var(--ts-pr-caret))!important}.ts-wrapper.plugin-drag_drop.multi>.ts-control>div.ui-sortable-placeholder{background:#f2f2f2!important;background:rgba(0,0,0,.06)!important;border:0!important;box-shadow:inset 0 0 12px 4px #fff;visibility:visible!important}.ts-wrapper.plugin-drag_drop .ui-sortable-placeholder:after{content:"!";visibility:hidden}.ts-wrapper.plugin-drag_drop .ui-sortable-helper{box-shadow:0 2px 5px rgba(0,0,0,.2)}.plugin-checkbox_options .option input{margin-right:.5rem}.plugin-clear_button{--ts-pr-clear-button:1em}.plugin-clear_button .clear-button{background:transparent!important;cursor:pointer;margin-right:0!important;opacity:0;position:absolute;right:2px;top:50%;transform:translateY(-50%);transition:opacity .5s}.plugin-clear_button.form-select .clear-button,.plugin-clear_button.single .clear-button{right:max(var(--ts-pr-caret),8px)}.plugin-clear_button.focus.has-items .clear-button,.plugin-clear_button:not(.disabled):hover.has-items .clear-button{opacity:1}.ts-wrapper .dropdown-header{background:#f8f8f8;border-bottom:1px solid #d0d0d0;border-radius:3px 3px 0 0;padding:10px 8px;position:relative}.ts-wrapper .dropdown-header-close{color:#303030;font-size:20px!important;line-height:20px;margin-top:-12px;opacity:.4;position:absolute;right:8px;top:50%}.ts-wrapper .dropdown-header-close:hover{color:#000}.plugin-dropdown_input.focus.dropdown-active .ts-control{border:1px solid #d0d0d0;box-shadow:none}.plugin-dropdown_input .dropdown-input{background:transparent;border:solid #d0d0d0;border-width:0 0 1px;box-shadow:inset 0 1px 1px rgba(0,0,0,.1);display:block;padding:8px;width:100%}.plugin-dropdown_input .items-placeholder{border:0!important;box-shadow:none!important;width:100%}.plugin-dropdown_input.dropdown-active .items-placeholder,.plugin-dropdown_input.has-items .items-placeholder{display:none!important}.ts-wrapper.plugin-input_autogrow.has-items .ts-control>input{min-width:0}.ts-wrapper.plugin-input_autogrow.has-items.focus .ts-control>input{flex:none;min-width:4px}.ts-wrapper.plugin-input_autogrow.has-items.focus .ts-control>input::-ms-input-placeholder{color:transparent}.ts-wrapper.plugin-input_autogrow.has-items.focus .ts-control>input::placeholder{color:transparent}.ts-dropdown.plugin-optgroup_columns .ts-dropdown-content{display:flex}.ts-dropdown.plugin-optgroup_columns .optgroup{border-right:1px solid #f2f2f2;border-top:0;flex-basis:0;flex-grow:1;min-width:0}.ts-dropdown.plugin-optgroup_columns .optgroup:last-child{border-right:0}.ts-dropdown.plugin-optgroup_columns .optgroup:before{display:none}.ts-dropdown.plugin-optgroup_columns .optgroup-header{border-top:0}.ts-wrapper.plugin-remove_button .item{align-items:center;display:inline-flex;padding-right:0!important}.ts-wrapper.plugin-remove_button .item .remove{border-radius:0 2px 2px 0;box-sizing:border-box;color:inherit;display:inline-block;padding:0 6px;text-decoration:none;vertical-align:middle}.ts-wrapper.plugin-remove_button .item .remove:hover{background:rgba(0,0,0,.05)}.ts-wrapper.plugin-remove_button.disabled .item .remove:hover{background:none}.ts-wrapper.plugin-remove_button .remove-single{font-size:23px;position:absolute;right:0;top:0}.ts-wrapper.plugin-remove_button:not(.rtl) .item .remove{border-left:1px solid #0073bb;margin-left:6px}.ts-wrapper.plugin-remove_button:not(.rtl) .item.active .remove{border-left-color:#00578d}.ts-wrapper.plugin-remove_button:not(.rtl).disabled .item .remove{border-left-color:#aaa}.ts-wrapper.plugin-remove_button.rtl .item .remove{border-right:1px solid #0073bb;margin-right:6px}.ts-wrapper.plugin-remove_button.rtl .item.active .remove{border-right-color:#00578d}.ts-wrapper.plugin-remove_button.rtl.disabled .item .remove{border-right-color:#aaa}.ts-wrapper{position:relative}.ts-control,.ts-control input,.ts-dropdown{font-smoothing:inherit;color:#303030;font-family:inherit;font-size:13px;line-height:18px}.ts-control,.ts-wrapper.single.input-active .ts-control{background:#fff;cursor:text}.ts-control{border:1px solid #d0d0d0;border-radius:3px;box-shadow:inset 0 1px 1px rgba(0,0,0,.1);box-sizing:border-box;display:flex;flex-wrap:wrap;overflow:hidden;padding:8px;position:relative;width:100%;z-index:1}.ts-wrapper.multi.has-items .ts-control{padding:5px 8px 2px}.full .ts-control{background-color:#fff}.disabled .ts-control,.disabled .ts-control *{cursor:default!important}.focus .ts-control{box-shadow:inset 0 1px 2px rgba(0,0,0,.15)}.ts-control>*{display:inline-block;vertical-align:baseline}.ts-wrapper.multi .ts-control>div{background:#1da7ee;border:1px solid #0073bb;color:#fff;cursor:pointer;margin:0 3px 3px 0;padding:2px 6px}.ts-wrapper.multi .ts-control>div.active{background:#92c836;border:1px solid #00578d;color:#fff}.ts-wrapper.multi.disabled .ts-control>div,.ts-wrapper.multi.disabled .ts-control>div.active{background:#d2d2d2;border:1px solid #aaa;color:#fff}.ts-control>input{background:none!important;border:0!important;box-shadow:none!important;display:inline-block!important;flex:1 1 auto;line-height:inherit!important;margin:0!important;max-height:none!important;max-width:100%!important;min-height:0!important;min-width:7rem;padding:0!important;text-indent:0!important;-webkit-user-select:auto!important;-moz-user-select:auto!important;-ms-user-select:auto!important;user-select:auto!important}.ts-control>input::-ms-clear{display:none}.ts-control>input:focus{outline:none!important}.has-items .ts-control>input{margin:0 4px!important}.ts-control.rtl{text-align:right}.ts-control.rtl.single .ts-control:after{left:15px;right:auto}.ts-control.rtl .ts-control>input{margin:0 4px 0 -2px!important}.disabled .ts-control{background-color:#fafafa;opacity:.5}.input-hidden .ts-control>input{left:-10000px;opacity:0;position:absolute}.ts-dropdown{background:#fff;border:1px solid #d0d0d0;border-radius:0 0 3px 3px;border-top:0;box-shadow:0 1px 3px rgba(0,0,0,.1);box-sizing:border-box;left:0;margin:.25rem 0 0;position:absolute;top:100%;width:100%;z-index:10}.ts-dropdown [data-selectable]{cursor:pointer;overflow:hidden}.ts-dropdown [data-selectable] .highlight{background:rgba(125,168,208,.2);border-radius:1px}.ts-dropdown .create,.ts-dropdown .no-results,.ts-dropdown .optgroup-header,.ts-dropdown .option{padding:5px 8px}.ts-dropdown .option,.ts-dropdown [data-disabled],.ts-dropdown [data-disabled] [data-selectable].option{cursor:inherit;opacity:.5}.ts-dropdown [data-selectable].option{cursor:pointer;opacity:1}.ts-dropdown .optgroup:first-child .optgroup-header{border-top:0}.ts-dropdown .optgroup-header{background:#fff;color:#303030;cursor:default}.ts-dropdown .active{background-color:#f5fafd;color:#495c68}.ts-dropdown .active.create{color:#495c68}.ts-dropdown .create{color:rgba(48,48,48,.5)}.ts-dropdown .spinner{display:inline-block;height:30px;margin:5px 8px;width:30px}.ts-dropdown .spinner:after{animation:lds-dual-ring 1.2s linear infinite;border-color:#d0d0d0 transparent;border-radius:50%;border-style:solid;border-width:5px;content:" ";display:block;height:24px;margin:3px;width:24px}@keyframes lds-dual-ring{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.ts-dropdown-content{overflow-scrolling:touch;max-height:200px;overflow-x:hidden;overflow-y:auto;scroll-behavior:smooth}.ts-hidden-accessible{clip:rect(0 0 0 0)!important;border:0!important;-webkit-clip-path:inset(50%)!important;clip-path:inset(50%)!important;overflow:hidden!important;padding:0!important;position:absolute!important;white-space:nowrap!important;width:1px!important}.ts-wrapper.single .ts-control{--ts-pr-caret:2rem}.ts-wrapper.single .ts-control:after{border-color:grey transparent transparent;border-style:solid;border-width:5px 5px 0;content:" ";display:block;height:0;margin-top:-3px;position:absolute;right:15px;top:50%;width:0}.ts-wrapper.single.dropdown-active .ts-control:after{border-color:transparent transparent grey;border-width:0 5px 5px;margin-top:-4px}.ts-wrapper.single.input-active .ts-control,.ts-wrapper.single.input-active .ts-control input{cursor:text}.ts-wrapper{display:flex;min-height:36px}.ts-wrapper.multi.has-items .ts-control{--ts-pr-min:$padding-x;padding-left:5px}.ts-wrapper.multi .ts-control [data-value]{background-color:#1b9dec;background-image:linear-gradient(180deg,#1da7ee,#178ee9);background-repeat:repeat-x;border-radius:3px;box-shadow:0 1px 0 rgba(0,0,0,.2),inset 0 1px hsla(0,0%,100%,.03);text-shadow:0 1px 0 rgba(0,51,83,.3)}.ts-wrapper.multi .ts-control [data-value].active{background-color:#0085d4;background-image:linear-gradient(180deg,#008fd8,#0075cf);background-repeat:repeat-x}.ts-wrapper.multi.disabled .ts-control [data-value]{background:none;box-shadow:none;color:#999;text-shadow:none}.ts-wrapper.multi.disabled .ts-control [data-value],.ts-wrapper.multi.disabled .ts-control [data-value] .remove{border-color:#e6e6e6}.ts-wrapper.multi.disabled .ts-control [data-value] .remove{background:none}.ts-wrapper.single .ts-control{background-color:#f9f9f9;background-image:linear-gradient(180deg,#fefefe,#f2f2f2);background-repeat:repeat-x;box-shadow:0 1px 0 rgba(0,0,0,.05),inset 0 1px 0 hsla(0,0%,100%,.8)}.ts-dropdown.single,.ts-wrapper.single .ts-control{border-color:#b8b8b8}.dropdown-active .ts-control{border-radius:3px 3px 0 0}.ts-dropdown .optgroup-header{font-size:.85em;font-weight:700;padding-top:7px}.ts-dropdown .optgroup{border-top:1px solid #f0f0f0}.ts-dropdown .optgroup:first-child{border-top:0}

.ts-control {
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  background-color: none !important;
  background-image: none !important;
  background-repeat: none !important;
  border-radius: 0 !important;
  outline: 0 !important;
  display: block;
  padding: 8px 0;
  cursor: pointer;
  font-size: 16px;
  opacity: 1;
}

.plugin-dropdown_input .dropdown-input {
  box-sizing: border-box;
}

.ts-dropdown {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  border-radius: 4px !important;
  border: 0;
}

.ts-dropdown-content input[type="checkbox"]{
  -webkit-appearance: auto !important;
  width: auto;
  margin: 0 0.5rem 0 0;
  width: 18px;
  height: 18px;
}

.ts-dropdown-content .option {
  height: 48px;
  font-size: 16px;
}

.ts-wrapper.multi .ts-control>div {
  border: none !important;
  background: none !important;
  box-shadow: none !important;
  background-color: none !important;
  background-image: none !important;
  background-repeat: none !important;
  border-radius: 0 !important;
  text-shadow: none !important;
  color: black;
}

.ts-wrapper.multi .ts-control>div.active {
  color: black;
}

.ts-wrapper.plugin-remove_button .item .remove {
  border-left: 0 !important;
  color: #ea4022;
  font-size: 24px;
  border-radius: 50%;
}

.ts-wrapper.multi .ts-control:after {
  border-color: grey transparent transparent;
  border-style: solid;
  border-width: 5px 5px 0;
  content: " ";
  display: block;
  height: 0;
  margin-top: -3px;
  position: absolute;
  right: 15px;
  top: 50%;
  width: 0;
}

.ts-wrapper.multi.dropdown-active .ts-control:after {
  border-color: transparent transparent grey;
  border-width: 0 5px 5px;
  margin-top: -4px;
}

.plugin-dropdown_input .dropdown-input {
margin: 0px 10px;
width: calc(100% - 20px);
border: 0;
border-bottom: 1px solid black;
margin-bottom: 10px;
box-shadow: none;
outline: none;
}

.ts-wrapper.locked .ts-control:after {
display: none;
}

.ts-wrapper .ts-control>div:first-child {
padding-left: 0;
}

.ts-wrapper.has-items .ts-control {
padding-right: 30px !important;
}

.ts-wrapper.locked .ts-control:after,
.ts-wrapper.locked.plugin-remove_button .item .remove {
display: none;
}

.item[data-value=""] .remove {
display: none !important;
}

</style>`;
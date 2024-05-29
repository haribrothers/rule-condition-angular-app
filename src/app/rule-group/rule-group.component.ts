import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { RuleConditionComponent } from '../rule-condition/rule-condition.component';
import { CommonModule, formatCurrency } from '@angular/common';

@Component({
  selector: 'app-rule-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RuleConditionComponent],
  templateUrl: './rule-group.component.html',
  styleUrl: './rule-group.component.css'
})
export class RuleGroupComponent {
  @Input() ruleForm!: FormGroup;
  @Input() showLine = true;
  @Output() onAddRule = new EventEmitter<{type: string, form: FormGroup}>();
  @Output() onDelete = new EventEmitter<{ rule: FormGroup}>();


  constructor() {
    console.log(this.ruleForm);
  }

  get conditions() {
    return this.ruleForm.get('conditions') as FormArray;
  }

  getCondition(condition: AbstractControl) {
    return condition as FormGroup;
  }


  isSimple(condition: AbstractControl) {
    if(condition.get('conditions')) {
      console.log(true)
      return false;
    }
    console.log(false)
    return true;
    // console.log(condition.get('operator'))
    // return condition.get('operator');
  }

  onAdd(type: 'rule'| 'rulegroup') {
    this.onAddRule.emit({type, form: this.ruleForm});
  }

  onAddEvent($event: {type: string, form: FormGroup}) {
    this.onAddRule.emit($event);
  }

  onRemove($event: {rule: FormGroup}) {
    let formarray = $event.rule.parent as FormArray;
    let index = formarray.controls.indexOf($event.rule);
    formarray.removeAt(index);
    // this.conditions.;
  }

  onDeleteClick() {
    this.onDelete.emit({ rule: this.ruleForm });
  }

  
}

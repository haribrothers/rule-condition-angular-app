import {  Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { RuleConditionComponent } from './rule-condition/rule-condition.component';
import { RuleGroupComponent } from './rule-group/rule-group.component';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, RuleConditionComponent, RuleGroupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'myapp';

  ruleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ruleForm = this.fb.group({
      rules: this.fb.array([this.createRuleGroup()])
    });
    console.log(this.ruleForm)
  }

  get rules(): FormArray {
    return this.ruleForm.get('rules') as FormArray;
  }

  getRule(rule: AbstractControl) {
    return rule as FormGroup;
  }

  addRule($event: {type: string, form: FormGroup}, rule: AbstractControl) {
    console.log($event);
    (($event.form.get('conditions')) as FormArray).push($event.type === 'rulegroup' ? this.createComplexCondition() : this.createSimpleCondition());
  }

  createRuleGroup() {
    return this.fb.group({
      operator: [true, Validators.required],
      conditions: this.fb.array([this.createSimpleCondition()])
    });
  }

  createSimpleCondition() {
    return this.fb.group({
      fact: ['', Validators.required],
      operator: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  createComplexCondition() {
    return this.createRuleGroup();
  }

  deleteRule(index: number) {
    this.rules.removeAt(index);
  }

  onSubmit() {
    if (this.ruleForm.valid) {
      console.log(this.ruleForm.value);
    }
  }

  generateSimpleCondition(condition: AbstractControl) {
    return condition.value as {fact: string, operator: string, value: string}
  }

  generateGroupCondition(condition: AbstractControl): any {
    let conds = []
    // console.log(condition);
    for(let innerCondition of (condition.get('conditions') as FormArray).controls) {
      if(innerCondition.get('conditions')) {
        conds.push(this.generateGroupCondition(innerCondition));
      } else {
        conds.push(this.generateSimpleCondition(innerCondition))
      }
    }

    // let operator: string = condition.get('operator')?.value ? 'and': 'or';
    if(condition.get('operator')?.value){
      return {
        "and": [
          ...conds
        ]
      }
    } else {
      return {
        "or": [
          ...conds
        ]
      }
    }
    
  }

  getJson() {
    let rules = [];
    for(let rule of this.rules.controls) {
      rules.push(this.generateGroupCondition(rule))
    }
    
    console.log(JSON.stringify(rules));
  }

  isSimple(condition: AbstractControl) {
    if(condition.get('conditions')) {
      console.log(true)
      return false;
    }
    console.log(false)
    return true;
  }

}

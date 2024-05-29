import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-condition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rule-condition.component.html',
  styleUrl: './rule-condition.component.css'
})
export class RuleConditionComponent {

  @Input() ruleForm!: FormGroup;
  @Output() onDelete = new EventEmitter<{ rule: FormGroup}>();

  onDeleteClick() {
    this.onDelete.emit({ rule: this.ruleForm });
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}
product: any;

  constructor() { }

  ngOnInit(): void {
  }

}

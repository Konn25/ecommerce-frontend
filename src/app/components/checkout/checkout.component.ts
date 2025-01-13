import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopFormService } from 'src/app/service/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent {


  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];


  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService){}

  ngOnInit(): void{

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
          firstName: [''],
          lastName: [''],
          email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),

      creditCardInfo: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expMonth: [''],
        expYear: ['']
      }),



    });


    const startMonth: number = new Date().getMonth() + 1;
    console.log("StartMonth: " + startMonth);
    
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " + JSON.stringify(data));
          this.creditCardMonth = data;
        }

    );

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card year: " + JSON.stringify(data));
        this.creditCardYears = data;
      }

  );

  }


  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }

  }




}

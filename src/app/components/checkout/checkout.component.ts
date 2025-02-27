import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/service/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

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

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService){}

  ngOnInit(): void{

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
          firstName: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
          lastName: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
          email: new FormControl('',         
            [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
          )
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])
      }),

      creditCardInfo: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
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

  this.shopFormService.getCountries().subscribe(
    data => {
      console.log("Countries from database: " + JSON.stringify(data));
      this.countries = data;
    }
  );


  }


  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYear(){
      
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFormGroup.value.expYear);

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1; 
    }
    else{
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log('Retrieved credit card months: '+ JSON.stringify(data));
        this.creditCardMonth = data;
      }

    );

  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
          if(formGroupName == 'shippingAddress'){
            this.shippingAddressStates = data;
          }
          else{
            this.billingAddressStates = data;
          }

          formGroup.get('state').setValue(data[0]);


      }
    );
  }

  //CUSTOMER
  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  //SHIPPING
  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState(){
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get shippingAddressCountry(){
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  //BILLING
  get billingAddressStreet(){
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity(){
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState(){
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode(){
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get billingAddressCountry(){
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  //CREDITCARD
  get creditCardType(){
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard(){
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber(){
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode(){
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
}

import { LightningElement, track } from 'lwc';
import createAppointment from '@salesforce/apex/CreateAppointmentController.createAppointment';
import checkAvailability from '@salesforce/apex/CreateAppointmentController.checkAvailability';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AppointmentForm extends LightningElement {

    @track date;
    @track time;
    @track description;
    @track subject;
    @track selectedContactId;

    handleDateChange(event) {
        this.date = event.target.value;
        console.log("Appointment Date is --> ", this.date)
    }

    handleTimeChange(event) {
        this.time = event.target.value;
        console.log("Appointment Time is --> ", this.time)
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
        console.log("Appointment Description is --> ", this.description)
    }

    handleSubjectChange(event) {
        this.subject = event.target.value;
        console.log("Appointment Subject is --> ", this.subject)
    }

    handleValueSelectedOnContact(event) {
        this.selectedContactId= event.detail.value;
        console.log(event.detail.id);
    }

    checkAvailability() {
        checkAvailability({
            sDate: this.date,
            slotTime: this.time
        })
        .then(result => {
            if (result) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Availability',
                        message: 'Selected date/time is available',
                        variant: 'success'
                    })
                );
            } else {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Availability',
                        message: 'Selected date/time is not available',
                        variant: 'error'
                    })
                );
            }
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }


    handleClick() { 
        createAppointment({
            appDate: this.date,
            appTime: this.time,
            description: this.description,
            subject: this.subject,
            contactId: this.selectedContactId
        })
        .then(() => {
            // Reset fields after successful submission
            this.date = '';
            this.time = '';
            this.description = '';
            this.subject = '';
            this.selectedContactId = '';
            
            // Show success toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Appointment created successfully',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            // Show error toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
}
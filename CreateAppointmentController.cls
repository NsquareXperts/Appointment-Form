public with sharing class CreateAppointmentController {
    
      @AuraEnabled
    public static Boolean checkAvailability(Date sDate, Time slotTime) {
        // Query the CheckAvailability__c object to check if the specified date and time exist
        List<Appointment_Slot__c> availabilityChecks = [SELECT Id FROM Appointment_Slot__c WHERE Appointment_Date__c = :sDate AND Start_Time__c = :slotTime AND isActive__c = true LIMIT 1];
        
        return availabilityChecks.isEmpty();
    }
    

    @AuraEnabled
    public static void createAppointment(Date appDate, Time appTime, String description, String subject, Id contactId) {
        // Query existing records with the same date and time
        List<Appointment_Detail__c> existingRecords = [SELECT Id FROM Appointment_Detail__c WHERE Appointment_Date__c = :appDate AND Appointment_Time__c = :appTime LIMIT 1];
        
        if(existingRecords.isEmpty()) {
            // No existing record found, proceed with insertion
            Appointment_Detail__c detail = new Appointment_Detail__c(
                Appointment_Date__c = appDate,
                Appointment_Time__c = appTime,
                Description__c = description,
                Subject__c = subject,
                Contact__c = contactId
            );
            insert detail;
        } else {
            // Existing record found, prevent insertion
            throw new AuraHandledException('A record with the same date and time already exists.');
        }
    }
}
/**
 * @description       :
 * @author            : Stewart Anderson
 * @group             :
 * @last modified on  : 07-31-2024
 * @last modified by  : Stewart Anderson
**/
public with sharing class AccountContactController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsWithContacts() {
        return [SELECT Id, Name, (SELECT Id, FirstName, LastName, Email FROM Contacts) FROM Account];
    }
}

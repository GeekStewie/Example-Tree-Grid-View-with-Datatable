/**
 * @description       :
 * @author            : Stewart Anderson
 * @group             :
 * @last modified on  : 07-31-2024
 * @last modified by  : Stewart Anderson
**/
import { LightningElement, wire, track } from 'lwc';
import getAccountsWithContacts from '@salesforce/apex/AccountContactController.getAccountsWithContacts';

export default class AccountTreeGrid extends LightningElement {
  @track gridData = [];
  @track selectedRows = [];
  @track selectedRowIds = [];  // Add this to track selected row IDs

  gridColumns = [
    { label: 'Account Name', fieldName: 'name', type: 'text' },
    { label: 'Contact Name', fieldName: 'contactName', type: 'text' },
    { label: 'Email', fieldName: 'email', type: 'email' }
  ];

  detailColumns = [
    { label: 'Name', fieldName: 'name', type: 'text' },
    { label: 'Email', fieldName: 'email', type: 'email' },
    {
      type: 'button',
      typeAttributes: {
        label: 'Remove',
        name: 'remove',
        title: 'Remove',
        iconName: 'utility:delete',
        variant: 'destructive-text'
      }
    }
  ];

  @wire(getAccountsWithContacts)
  wiredAccounts({ error, data }) {
    if (data) {
      this.gridData = data.map(account => ({
        id: account.Id,
        name: account.Name,
        type: 'Account',
        _children: account.Contacts ? account.Contacts.map(contact => ({
          id: contact.Id,
          contactName: `${contact.FirstName} ${contact.LastName}`,
          email: contact.Email,
          type: 'Contact'
        })) : []
      }));
    } else if (error) {
      console.error('Error:', error);
    }
  }

  handleRowSelection(event) {
    this.selectedRows = event.detail.selectedRows.map(row => ({
      id: row.id,
      name: row.type === 'Contact' ? row.contactName : row.name,
      email: row.type === 'Contact' ? row.email : '-',
      type: row.type
    }));
    this.selectedRowIds = this.selectedRows.map(row => row.id);
  }

  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;
    if (action.name === 'remove') {
      this.selectedRows = this.selectedRows.filter(selectedRow => selectedRow.id !== row.id);
      this.selectedRowIds = this.selectedRows.map(row => row.id);
    }
  }
}

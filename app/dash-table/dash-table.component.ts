import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dash-table',
  templateUrl: './dash-table.component.html',
  styleUrls: ['./dash-table.component.css'],
})
export class DashTableComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = true;
  editMode: boolean = false;
  currentUser: any = null;
  userForm: FormGroup;
  searchQuery: string = '';
  selectAll: boolean = false;
  showPopup: boolean = false;
  selectedUser: any = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.http.get('http://localhost:3000/api/users').subscribe(
      (response: any) => {
        this.users = response.users.reverse()
          .map((user: any) => ({ ...user, selected: false }))
          .sort(
            (a: { createdAt: string }, b: { createdAt: string }) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ); // Sort by latest to oldest
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  toggleSelectAll(): void {
    this.users.forEach((user) => {
      user.selected = this.selectAll;
    });
  }

  deleteSelectedUsers(): void {
    const selectedUserIds = this.users
      .filter((user) => user.selected)
      .map((user) => user._id);

    if (selectedUserIds.length === 0) {
      alert('No users selected for deletion.');
      return;
    }

    if (confirm('Are you sure you want to delete the selected users?')) {
      this.http
        .post('http://localhost:3000/api/users/delete-multiple', { ids: selectedUserIds })
        .subscribe(
          () => {
            this.users = this.users.filter((user) => !selectedUserIds.includes(user._id));
            alert('Selected users deleted successfully.');
          },
          (error) => {
            console.error('Error deleting selected users:', error);
          }
        );
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:3000/api/users/${userId}`).subscribe(
        () => {
          this.users = this.users.filter((user) => user._id !== userId);
          alert('User deleted successfully.');
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  editUser(user: any): void {
    this.editMode = true;
    this.currentUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    });
  }

  updateUser(): void {
    if (this.userForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    this.http.put(`http://localhost:3000/api/users/${this.currentUser._id}`, this.userForm.value).subscribe(
      (response: any) => {
        const index = this.users.findIndex((user) => user._id === this.currentUser._id);
        if (index !== -1) {
          this.users[index] = { ...response.user, selected: this.users[index].selected };
        }
        this.cancelEdit();
        alert('User updated successfully.');
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentUser = null;
    this.userForm.reset();
  }

  addUser(): void {
    if (this.userForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    this.http.post('http://localhost:3000/api/users', this.userForm.value).subscribe(
      (response: any) => {
        this.users.unshift({ ...response.user, selected: false });
        this.userForm.reset();
        alert('User added successfully.');
      },
      (error) => {
        console.error('Error adding user:', error);
      }
    );
  }

  viewUser(user: any): void {
    this.selectedUser = user;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedUser = null;
  }
}

# INVFriend - User Acceptance Testing Checklist

## Pre-requisites

- [x] Firebase project created and configured
- [x] Firebase Authentication enabled (Email/Password)
- [x] Firestore database enabled
- [x] Environment variables configured

---

## 1. Authentication Flow

### 1.1 Registration

- [x] User can access registration page
- [x] Form validates email format
- [x] Form validates password requirements
- [x] User can register with valid credentials
- [x] User receives confirmation/feedback after registration
- [x] Registration errors are displayed clearly

### 1.2 Login

- [x] User can access login page
- [x] User can login with valid credentials
- [x] Invalid credentials show error message
- [x] User is redirected to home/groups after login
- [x] Auth token is stored properly

### 1.3 Logout

- [x] User can logout from any authenticated page
- [x] Session is cleared after logout
- [x] User is redirected to login page

---

## 2. Group Management

### 2.1 Create Group

- [x] Admin can create a new group
- [x] Form requires: name, budget limit
- [x] Optional: description
- [x] Group is created with admin as first member
- [x] Admin is redirected to group detail after creation

### 2.2 View Groups

- [x] User can see list of their groups
- [x] Shows group name, member count, raffle status
- [x] Distinguishes between admin and member roles
- [ ] Empty state shown when no groups exist

### 2.3 View Group Details

- [x] Members can see group details
- [x] Shows: name, description, budget, members list
- [x] Shows raffle status (pending/completed)
- [x] Admin sees additional management options

### 2.4 Add Members (Admin only)

- [ ] Admin can add members by user ID/email
- [ ] Cannot add duplicate members
- [ ] New member appears in members list
- [ ] Non-admin cannot add members

### 2.5 Remove Members (Admin only)

- [ ] Admin can remove members
- [ ] Cannot remove self if only member
- [ ] Removed member no longer appears in list
- [ ] Non-admin cannot remove members

### 2.6 Update Group (Admin only)

- [ ] Admin can update name, description, budget
- [ ] Changes are saved and reflected
- [ ] Non-admin cannot update group

### 2.7 Delete Group (Admin only)

- [ ] Admin can delete group
- [ ] Confirmation required before deletion
- [ ] Group no longer appears in lists
- [ ] Non-admin cannot delete group

---

## 3. Wish Management

### 3.1 Add Wish

- [x] Member can add wish to their wishlist
- [x] Form requires: title, priority
- [x] Optional: description, URL
- [x] Wish appears in user's list

### 3.2 View My Wishes

- [x] User can see their own wishes for a group
- [x] Wishes shown with title, description, priority
- [x] Can edit own wishes
- [x] Can delete own wishes

### 3.3 Update Wish

- [x] User can edit their own wish
- [x] Changes are saved and reflected
- [ ] Cannot edit other users' wishes

### 3.4 Delete Wish

- [x] User can delete their own wish (confirmation modal shown)
- [ ] Wish is removed from list
- [ ] Cannot delete other users' wishes

### 3.5 View Assigned Person's Wishes (Post-Raffle)

- [ ] After raffle, can see assigned person's wishes
- [ ] Shows all wishes from assigned recipient
- [ ] Cannot see wishes before raffle is performed

---

## 4. Raffle System

### 4.1 Pre-conditions

- [ ] Group has minimum 3 members
- [ ] Group status is "pending"

### 4.2 Perform Raffle (Admin only)

- [ ] Admin can trigger raffle
- [ ] Confirmation before executing
- [ ] All members get unique assignment
- [ ] No member is assigned to themselves
- [ ] Group status changes to "completed"
- [ ] Non-admin cannot perform raffle

### 4.3 View Assignment

- [ ] After raffle, member can see who they're Secret Santa for
- [ ] Shows assigned person's name/ID
- [ ] Cannot see assignment before raffle
- [ ] Cannot see other members' assignments

### 4.4 Assignment Rules

- [ ] Every member gets exactly one assignment
- [ ] Every member is assigned to exactly one person
- [ ] No self-assignments
- [ ] Assignments are kept secret

---

## 5. Notifications

### 5.1 Toast Notifications

- [ ] Success notifications appear (green)
- [ ] Error notifications appear (red)
- [ ] Info notifications appear (blue)
- [ ] Warning notifications appear (yellow)
- [ ] Notifications auto-dismiss after timeout
- [ ] Can manually dismiss notifications

---

## 6. Error Handling

### 6.1 API Errors

- [ ] Network errors show user-friendly message
- [ ] 401 errors redirect to login
- [ ] 403 errors show "not authorized" message
- [ ] 404 errors show "not found" message
- [ ] Server errors show generic error message

### 6.2 Form Validation

- [ ] Required fields show validation errors
- [ ] Invalid formats show clear messages
- [ ] Form cannot be submitted with errors

---

## 7. Security

### 7.1 Authentication

- [ ] Unauthenticated users cannot access protected routes
- [ ] Token is refreshed properly
- [ ] Session expires appropriately

### 7.2 Authorization

- [ ] Non-members cannot access group details
- [ ] Non-admins cannot perform admin actions
- [ ] Users cannot modify other users' data

---

## 8. Performance

### 8.1 Load Times

- [ ] Initial page load < 3 seconds
- [ ] API responses < 2 seconds
- [ ] No UI blocking during operations

### 8.2 Responsiveness

- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)

---

## Sign-off

| Tester                       | Date        | Status       | Notes                                                |
| ---------------------------- | ----------- | ------------ | ---------------------------------------------------- |
| Claude + Chrome DevTools MCP | Feb 1, 2026 | Partial Pass | Core flows working. Raffle needs 3+ members to test. |

---

## Notes

- All test cases should be executed on production build
- Document any bugs found with steps to reproduce
- Record screenshots/videos for failed test cases

### UAT Session Notes - Feb 1, 2026

**Environment:** https://invfriend.web.app

**Fixes Applied During UAT:**

1. Added Firestore composite index for groups query (members + createdAt)
2. Auth service rewritten to use Firebase Auth SDK directly

**Known Issues:**

- User ID shown instead of display name in members list (bB7pcbnteHU7SU0I0by06dYTOXl1)
- Raffle system untested (requires 3+ members)
- Add/Remove members functionality untested

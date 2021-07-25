# Quest Team Dynamics

|         Member         |            Role/Responsiblities            |
| :--------------------: | :----------------------------------------: |
| @Soughtout & @TheQueen |  Business Growth, Marketing & Legalities   |
| @IMaGe323 & @ikonicbi  | Figma Design --to--> Html/CSS/JS/API Calls |
|     @Chris Barnes      | API/Backend/FireBase (Authentication & DB) |

    Work on anything for frontend in public and anything backend in functions

Note: The above is not fully acurate - it should really be \
**_Frontend_** in `src/components/` `Displays/` or `Auth/` or `Utils/` & \
**_Backend_** in src/components/ `Firebase/` or `services/`

---

## Front-End Pages & [Style Sheet](https://github.com/QuestPi/Backend/blob/main/public/src/styles.css) Need to be updated to [Figma Designs](https://www.figma.com/file/ecxlQEZdyhfyMWRHQBpDmY/Quest?node-id=0%3A1)

- [ ] Not Found / Error Page(s)
- [ ] Confirmations, Pop-ups, & Modals
- [ ] Landing Page
- [ ] [Authentication Pages](https://github.com/QuestPi/Backend/tree/main/public/src/components/Auth)
  - [ ] Sign-Up
  - [ ] Sign-In
  - [ ] Forgot-Password
  - [ ] Reset-Password
  - [ ] Phone Verification
  - [ ] Account
- [ ] Main [Display Pages](https://github.com/QuestPi/Backend/tree/main/public/src/components/Displays) others may include
  - [ ] Admin Page(s) for the Quest Team
  - [ ] Admin Page(s) for each seller/business
  - [ ] Business/Store Listing
  - [ ] Product Listing
  - [ ] G-Maps Integration pages i.e sections on business listing

PWA Routing & Navigation

- [All Available Routes](https://github.com/QuestPi/Backend/blob/main/public/src/routes.js)
- [Available Routes Depending on Authentication](https://github.com/QuestPi/Backend/blob/main/public/src/components/App.js)
- [Bottom Navigation Bar](https://github.com/QuestPi/Backend/blob/main/public/src/components/Navigation.js)

---

## Backend/Api Options Needed:

### **_Pi API_**

- authenticatePiUser()
- createPiPayment(config)
- onIncompletePaymentFound(payment)
- onReadyForApproval(paymentId, paymentConfig)
- onReadyForCompletion(paymentId, txid)
- onCancel(paymentId)
- onError(error, paymentId)
- openPiShareDialog(title, message)

---

### **_FireBase Auth API_**

- doCreateUserWithEmailAndPassword(email, password)
- doSignInWithEmailAndPassword(email, password)
- doSignInWithGoogle()
- doSignInWithFacebook()
- doSignInWithTwitter()
- doSignOut()
- doPasswordReset(email)
- doPasswordUpdate(password)
- doSendEmailVerification()

### **_User API_**

- user(uid)
- users()
- setUserBusiness(userID, businessID)

#### **_Merge Auth and DB User API_**

- onAuthUserListener(next, fallback)

### **_Business API_**

- business(uid)
- businesses()
- createBusiness(businessData)

### **_Product API_**

- product(uid)
- products()
- createProduct(productData)

---

### API - FireBase - Pi Network (Back-End/FireBase)

https://github.com/QuestPi/Backend/tree/main/public/src/components/Firebase \
https://github.com/QuestPi/Backend/tree/main/public/src/services \
https://github.com/QuestPi/Backend/tree/main/functions

---

https://console.firebase.google.com/u/0/project/quest-pi/overview \
https://console.firebase.google.com/u/0/project/quest-pi/database \
https://console.firebase.google.com/u/0/project/quest-pi/hosting/sites \
https://console.firebase.google.com/u/0/project/quest-pi/authentication/users

---

## Auth Flow

By Following https://github.com/QuestPi/Backend & https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md#authentication

1. Connect to questpi.co in the pi-browser --> A pop-up confirmation/access screen will appear, press `Allow` and then continue on. \
   ( If Pioneer is accessing through the pi-app/browser process will complete properly otherwise they will be prompted to download it from their respective platform. )
2. Prompt TroubleShooting Support (If Needed) \
   --> display internet connection \
   --> display how to find username/address/id \
   --> Other issues send a support request via github/email
3. Sent to "Home Page" (Shop layout)
4. Pioneers can visit their Account Page for extra configurations
5. Account designation (business vs customer) \
   -- Both Connect to FaceBook/Google/Apple

   -- Business \
   --> pull google data (location, name, hours, phone, etc) \
   --> display for pulled data \
   --> Search List of Businesses \
   -- Customer \
   --> Favorites List \
   --> Friends List \
   --> Current Location (used for nearby lookup - Friend & Businesses)

---

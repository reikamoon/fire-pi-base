# Current API Setup

## **_FireBase Auth API_**

- doCreateUserWithEmailAndPassword(email, password)
- doSignInWithEmailAndPassword(email, password)
- doSignInWithGoogle()
- doSignInWithFacebook()
- doSignInWithTwitter()
- doSignOut()
- doPasswordReset(email)
- doPasswordUpdate(password)
- doSendEmailVerification()

## **_User API_**

- user(uid)
- users()
- setUserBusiness(userID, businessID)

## **_Merge Auth and DB User API_**

- onAuthUserListener(next, fallback)


## **_Business API_**

- business(uid)
- businesses()
- createBusiness(businessData)

## **_Product API_**

- product(uid)
- products()
- createProduct(productData)

---

## **_Pi API_**

- authenticatePiUser()
- createPiPayment(config)
- onIncompletePaymentFound(payment)
- onReadyForApproval(paymentId, paymentConfig)
- onReadyForCompletion(paymentId, txid)
- onCancel(paymentId)
- onError(error, paymentId)
- openPiShareDialog(title, message)
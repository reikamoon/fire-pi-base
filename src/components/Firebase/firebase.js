import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/analytics';
import 'firebase/performance';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */
    this.serverValue = app.database.ServerValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
    this.analytics = app.analytics();
    this.performance = app.performance();

    /* Social Sign In Method Provider */
    // this.googleProvider = new app.auth.GoogleAuthProvider();
    // this.facebookProvider = new app.auth.FacebookAuthProvider();
    // this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) => {
    this.analytics.logEvent('Created A New User Using Email & Pass');
    return this.auth.createUserWithEmailAndPassword(email, password);
  };

  doSignInWithEmailAndPassword = (email, password) => {
    this.analytics.logEvent('User Logged In Using Email & Pass');
    return this.auth.signInWithEmailAndPassword(email, password);
  };

  doSignInWithGoogle = () => {
    this.analytics.logEvent('User Logged In Using Google');
    return this.auth.signInWithPopup(this.googleProvider);
  };

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => {
    this.analytics.logEvent('User Logged Out');
    return this.auth.signOut();
  };

  doPasswordReset = (email) => {
    this.analytics.logEvent('User Tried To Rest Their Password');
    return this.auth.sendPasswordResetEmail(email);
  };

  doPasswordUpdate = (password) => {
    this.analytics.logEvent('User Changed Their Password');
    return this.auth.currentUser.updatePassword(password);
  };

  doSendEmailVerification = () => {
    this.analytics.logEvent('Email Verification Sent');
    return this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT || 'http://localhost:3000/',
    });
  };

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then((snapshot) => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = 'EMPLOYEE';
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***
  user = (uid) => {
    this.analytics.logEvent("Referencing A User's Data");
    return this.db.ref(`users/${uid}`);
  };
  users = () => {
    this.analytics.logEvent('Referencing Users List');
    return this.db.ref('users');
  };
  setUserBusiness = (userID, businessID) => this.user(userID).update({ business_id: businessID });

  // **** Business API ***
  business = (uid) => {
    this.analytics.logEvent("Referencing A Business's Data");
    return this.db.ref(`businesses/${uid}`);
  };
  businesses = () => {
    this.analytics.logEvent("Referencing Businesses List");
    return this.db.ref('businesses');
  };

  createBusiness = (businessData) => {
    var newBusinessKey = this.db.ref('businesses').push().key;
    var updates = {};
    updates['/businesses/' + newBusinessKey] = businessData;
    updates['/users/' + businessData.owner.ownerID + '/businesses/' + businessData.businessTitle] = newBusinessKey;
    updates['/users/' + businessData.owner.ownerID + '/business_id'] = newBusinessKey;

    this.analytics.logEvent("Creating A New Business");
    this.db.ref().update(updates);
    return newBusinessKey;
  };

  // *** Report API ***
  report = (uid) => {
    this.analytics.logEvent("Referencing A Reports's Data");
    return this.db.ref(`reports/${uid}`);
  };
  reports = () => {
    this.analytics.logEvent("Referencing Reports List");
    return this.db.ref('reports');
  };

  createReport = (reportData) => {
    let { location, reportTitle, reporter } = reportData;
    let { businessID, buildingID, floorID, roomID } = location;

    // Get a key for a new room.
    var newReportKey = this.db.ref('reports').push().key;
    // Write the new room's data simultaneously in the compnay list and the user's businesses list.
    var updates = {};
    // updates['/businesses/' + businessID + '/buildings/' + buildingID + '/floors/' + floorID + '/rooms/' + roomID + '/reports/' + reportTitle] = newReportKey;
    updates['/reports/' + newReportKey] = reportData;
    updates['/users/' + reporter.ownerID + '/reports/' + reportTitle] = newReportKey;

    console.log(businessID, buildingID, floorID, roomID, reportTitle, reporter);
    this.analytics.logEvent("Creating A New Report");
    this.db.ref().update(updates);
    return newReportKey;
  };
}

export default Firebase;

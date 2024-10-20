package com.cm_app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.*
import kotlinx.coroutines.tasks.await // Ensure this import is present

class CollegeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var firestore: FirebaseFirestore? = null
    private val coroutineScope = CoroutineScope(Dispatchers.IO)

    override fun getName(): String {
        return "CollegeModule"
    }

    // Method to set the Firestore instance
    @ReactMethod
    fun setConfig(instance: FirebaseFirestore) {
        firestore = instance
    }

    // Method to fetch college data
    @ReactMethod
    fun loadDataFromFirebase(promise: Promise) {
        coroutineScope.launch {
            try {
                // Check if Firestore is initialized
                val firestoreInstance = firestore ?: run {
                    promise.reject("Firestore Error", "Firestore has not been initialized.")
                    return@launch
                }

                // Example Firebase query to fetch data
                val documents = firestoreInstance.collection("CompleteColleges").get().await() // Await the Firestore call

                // Process documents
                val data = documents.documents.map { it.data } // Mapping the document data

                // Return the result back to the JS thread
                withContext(Dispatchers.Main) {
                    promise.resolve(data) // Resolves the data to JS
                }

            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    promise.reject("DataLoadError", e.message)
                }
            }
        }
    }
}

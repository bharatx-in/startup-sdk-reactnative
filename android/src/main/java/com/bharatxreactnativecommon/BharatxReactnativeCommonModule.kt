package com.bharatxreactnativecommon

import androidx.annotation.Nullable
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import tech.bharatx.common.BharatXCommonUtilManager
import tech.bharatx.common.CreditAccessManager
import tech.bharatx.common.data_classes.CreditInfo
import kotlin.math.roundToLong


class BharatxReactnativeCommonModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "BharatxReactnativeCommon"
  }

  private fun sendEvent(reactContext: ReactContext,
                        eventName: String,
                        @Nullable params: WritableMap) {
    reactContext
      .getJSModule(RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  @ReactMethod
  fun registerCreditAccess() {
    CreditAccessManager.register(currentActivity!!)
  }

  @ReactMethod
  fun showBharatXProgressDialog() {
    BharatXCommonUtilManager.showBharatXProgressDialog((currentActivity as FragmentActivity?)!!)
  }

  @ReactMethod
  fun closeBharatXProgressDialog() {
    BharatXCommonUtilManager.closeBharatXProgressDialog()
  }

  @ReactMethod
  fun getUserCreditInfo(onComplete: Callback) {
    CreditAccessManager.getUserCreditInfo(currentActivity!!, object : CreditAccessManager.OnCreditInfoCompleteListener {
      override fun onComplete(creditInfo: CreditInfo) {
        val creditTaken = creditInfo.creditTaken
        val creditLimit = creditInfo.creditLimit
        onComplete.invoke(creditTaken.toDouble(), creditLimit.toDouble())
      }
    })
  }

  @ReactMethod
  fun confirmTransactionWithUser(amountInPaise: Double) {
    BharatXCommonUtilManager.confirmTransactionWithUser(
      currentActivity!!,
      amountInPaise.roundToLong(),
      object : BharatXCommonUtilManager.TransactionConfirmationListener {
        override fun onUserConfirmedTransaction() {
          sendEvent(reactApplicationContext, "confirmTransactionWithUser",
            Arguments.createMap().apply {
              putString("value", "onUserConfirmedTransaction")
            })
        }

        override fun onUserAcceptedPrivacyPolicy() {
          sendEvent(reactApplicationContext, "confirmTransactionWithUser",
            Arguments.createMap().apply {
              putString("value", "onUserAcceptedPrivacyPolicy")
            })
        }

        override fun onUserCancelledTransaction() {
          sendEvent(reactApplicationContext, "confirmTransactionWithUser",
            Arguments.createMap().apply {
              putString("value", "onUserCancelledTransaction")
            })
        }
      })
  }

  @ReactMethod
  fun showTransactionStatusDialog(isTransactionSuccessful: Boolean, onStatusDialogClose: Callback) {
    BharatXCommonUtilManager.showTransactionStatusDialog(currentActivity!!, isTransactionSuccessful,
      object : BharatXCommonUtilManager.TransactionStatusShowListener {
        override fun onStatusDialogClose() {
          onStatusDialogClose.invoke()
        }
      })
  }

  @ReactMethod
  fun registerTransactionId(transactionId: String, successFailureCallback: Callback) {
    CreditAccessManager.registerTransactionId((currentActivity as FragmentActivity?)!!, transactionId, object : CreditAccessManager.RegisterTransactionListener {
      override fun onFailure() {
        successFailureCallback.invoke(false)
      }

      override fun onRegistered() {
        successFailureCallback.invoke(true)
      }
    })
  }

  @ReactMethod
  fun registerUserId(userId: String) {
    BharatXCommonUtilManager.registerUserId((currentActivity as FragmentActivity?)!!, userId)
  }
}

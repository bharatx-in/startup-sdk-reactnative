package com.bharatxreactnativecommon

import androidx.annotation.Nullable
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import tech.bharatx.common.*
import tech.bharatx.common.data_classes.CreditInfo
import tech.bharatx.common.data_classes.CreditInfoFull
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
  fun registerUser(userDetails: ReadableMap) {
    val bharatXUserManager = BharatXUserManager(currentActivity!!)
    val userDetailsMap = userDetails.toHashMap()
    for((key, value) in userDetailsMap) {
      when(key) {
        "phoneNumber" -> {
          bharatXUserManager.phoneNumber(value as String)
        }
        "id" -> {
          bharatXUserManager.id(value as String)
        }
        "name" -> {
          bharatXUserManager.name(value as String)
        }
        "gender" -> {
          bharatXUserManager.gender(value as String)
        }
        "dob" -> {
          val dobFormat: String? = userDetailsMap["dobFormat"] as String?
          if(dobFormat.isNullOrBlank()) {
            bharatXUserManager.dob(value as String)
          } else {
            bharatXUserManager.dob(value as String, dobFormat)
          }
        }
        "dobFormat" -> {}
        "age" -> {
          bharatXUserManager.age((value as Double).toInt())
        }
        "address" -> {
          bharatXUserManager.address(value as String)
        }
        else -> {
          if(value is String) {
            bharatXUserManager.prop(key, value)
          }
        }
      }
    }
    bharatXUserManager.register()
  }

  @ReactMethod
  fun displayBharatXProgressDialog() {
    BharatXUiManager.displayBharatXProgressDialog((currentActivity as FragmentActivity?)!!)
  }

  @ReactMethod
  fun closeBharatXProgressDialog() {
    BharatXUiManager.closeBharatXProgressDialog()
  }

  @ReactMethod
  fun getUserCreditInfo(onComplete: Callback) {
    CreditAccessManager.getUserCreditInfo((currentActivity as FragmentActivity?)!!,
      object : CreditAccessManager.OnCompleteListener<CreditInfo> {
        override fun onComplete(result: CreditInfo) {
          onComplete.invoke(
            WritableNativeMap().apply {
              putDouble("creditTaken", result.creditTaken.toDouble())
              putDouble("creditLimit", result.creditLimit.toDouble())
            }
          )
        }
      })
  }

  @ReactMethod
  fun getUserCreditInfoFull(onComplete: Callback) {
    CreditAccessManager.getUserCreditInfoFull((currentActivity as FragmentActivity?)!!,
      object : CreditAccessManager.OnCompleteListener<CreditInfoFull> {
        override fun onComplete(result: CreditInfoFull) {
          onComplete.invoke(
            WritableNativeMap().apply {
              putDouble("creditTaken", result.creditTaken.toDouble())
              putDouble("creditLimit", result.creditLimit.toDouble())
              putDouble("dueAmount", result.dueAmount.toDouble())
              putDouble("totalOutstandingAmount", result.totalOutstandingAmount.toDouble())
              putString("currentCycleDueDate", result.currentCycleDueDate)
              putString("repaymentLink", result.repaymentLink)
            }
          )
        }
      })
  }

  @ReactMethod
  fun confirmTransactionWithUser(amountInPaise: Double, transactionId: String) {
    BharatXTransactionManager.confirmTransactionWithUser(
      currentActivity!!,
      amountInPaise.roundToLong(),
      transactionId,
      object : BharatXTransactionManager.TransactionStatusListener() {
        override fun onSuccess() {
          sendEvent(reactApplicationContext, "confirmTransactionWithUser",
            Arguments.createMap().apply {
              putString("value", "onSuccess")
            })
        }

        override fun onFailure(transactionFailureReason: BharatXTransactionManager.TransactionFailureReason) {
          sendEvent(reactApplicationContext, "confirmTransactionWithUser",
            Arguments.createMap().apply {
              putString("value", "onFailure")
              putString("transactionFailureReason", transactionFailureReason.getSerializedNameFromEnum())
            })
        }
      }
    )
  }
}

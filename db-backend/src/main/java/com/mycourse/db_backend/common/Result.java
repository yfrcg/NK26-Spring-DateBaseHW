package com.mycourse.db_backend.common;
/**
 * 统一返回体，用来封装 code、message 和 data。
 */
public class Result<T> {
/**
 * 保存编码。
 */
private Integer code;
/**
 * 保存message。
 */
private String message;
/**
 * 保存数据。
 */
private T data;
/**
 * 执行success相关处理。
 */
public static <T> Result<T> success(T data) {
        return new Result<>(200, "success", data);
    }
/**
 * 执行success相关处理。
 */
public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }
/**
 * 执行fail相关处理。
 */
public static <T> Result<T> fail(Integer code, String message) {
        return new Result<>(code, message, null);
    }
/**
 * 执行fail相关处理。
 */
public static <T> Result<T> fail(String message) {
        return new Result<>(500, message, null);
    }
/**
 * 获取编码。
 */
public Integer getCode() {
        return this.code;
    }
/**
 * 获取message。
 */
public String getMessage() {
        return this.message;
    }
/**
 * 获取数据。
 */
public T getData() {
        return this.data;
    }
/**
 * 设置编码。
 */
public void setCode(final Integer code) {
        this.code = code;
    }
/**
 * 设置message。
 */
public void setMessage(final String message) {
        this.message = message;
    }
/**
 * 设置数据。
 */
public void setData(final T data) {
        this.data = data;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof Result)) return false;
        final Result<?> other = (Result<?>) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$code = this.getCode();
        final java.lang.Object other$code = other.getCode();
        if (this$code == null ? other$code != null : !this$code.equals(other$code)) return false;
        final java.lang.Object this$message = this.getMessage();
        final java.lang.Object other$message = other.getMessage();
        if (this$message == null ? other$message != null : !this$message.equals(other$message)) return false;
        final java.lang.Object this$data = this.getData();
        final java.lang.Object other$data = other.getData();
        if (this$data == null ? other$data != null : !this$data.equals(other$data)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof Result;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $code = this.getCode();
        result = result * PRIME + ($code == null ? 43 : $code.hashCode());
        final java.lang.Object $message = this.getMessage();
        result = result * PRIME + ($message == null ? 43 : $message.hashCode());
        final java.lang.Object $data = this.getData();
        result = result * PRIME + ($data == null ? 43 : $data.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "Result(code=" + this.getCode() + ", message=" + this.getMessage() + ", data=" + this.getData() + ")";
    }
/**
 * 构造Result，并注入当前类运行所需的依赖对象。
 */
public Result() {
    }
/**
 * 构造Result，并注入当前类运行所需的依赖对象。
 */
public Result(final Integer code, final String message, final T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}

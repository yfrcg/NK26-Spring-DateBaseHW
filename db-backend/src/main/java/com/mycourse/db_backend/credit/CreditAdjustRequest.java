package com.mycourse.db_backend.credit;

import jakarta.validation.constraints.NotNull;
/**
 * 信用调整请求参数对象，用来封装接口入参。
 */
public class CreditAdjustRequest {
    /**
     * 保存本次信用分变动值。
     */
@NotNull(message = "变更分值不能为空")
    private Integer changeScore;
/**
 * 保存原因说明。
 */
private String reason;
/**
 * 保存操作人用户ID。
 */
private Long operatorUserId;
/**
 * 构造CreditAdjustRequest，并注入当前类运行所需的依赖对象。
 */
public CreditAdjustRequest() {
    }
/**
 * 获取本次信用分变动值。
 */
public Integer getChangeScore() {
        return this.changeScore;
    }
/**
 * 获取原因说明。
 */
public String getReason() {
        return this.reason;
    }
/**
 * 获取操作人用户ID。
 */
public Long getOperatorUserId() {
        return this.operatorUserId;
    }
/**
 * 设置本次信用分变动值。
 */
public void setChangeScore(final Integer changeScore) {
        this.changeScore = changeScore;
    }
/**
 * 设置原因说明。
 */
public void setReason(final String reason) {
        this.reason = reason;
    }
/**
 * 设置操作人用户ID。
 */
public void setOperatorUserId(final Long operatorUserId) {
        this.operatorUserId = operatorUserId;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof CreditAdjustRequest)) return false;
        final CreditAdjustRequest other = (CreditAdjustRequest) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$changeScore = this.getChangeScore();
        final java.lang.Object other$changeScore = other.getChangeScore();
        if (this$changeScore == null ? other$changeScore != null : !this$changeScore.equals(other$changeScore)) return false;
        final java.lang.Object this$operatorUserId = this.getOperatorUserId();
        final java.lang.Object other$operatorUserId = other.getOperatorUserId();
        if (this$operatorUserId == null ? other$operatorUserId != null : !this$operatorUserId.equals(other$operatorUserId)) return false;
        final java.lang.Object this$reason = this.getReason();
        final java.lang.Object other$reason = other.getReason();
        if (this$reason == null ? other$reason != null : !this$reason.equals(other$reason)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof CreditAdjustRequest;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $changeScore = this.getChangeScore();
        result = result * PRIME + ($changeScore == null ? 43 : $changeScore.hashCode());
        final java.lang.Object $operatorUserId = this.getOperatorUserId();
        result = result * PRIME + ($operatorUserId == null ? 43 : $operatorUserId.hashCode());
        final java.lang.Object $reason = this.getReason();
        result = result * PRIME + ($reason == null ? 43 : $reason.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "CreditAdjustRequest(changeScore=" + this.getChangeScore() + ", reason=" + this.getReason() + ", operatorUserId=" + this.getOperatorUserId() + ")";
    }
}

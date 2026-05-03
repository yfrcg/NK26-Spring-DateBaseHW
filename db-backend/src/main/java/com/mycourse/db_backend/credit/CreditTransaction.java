package com.mycourse.db_backend.credit;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
/**
 * 信用流水实体类，用来保存相关业务数据。
 */
@Entity
@Table(name = "credit_transactions")
public class CreditTransaction {
    /**
     * 保存信用交易ID。
     */
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credit_txn_id")
    private Long creditTxnId;
    /**
     * 保存用户ID。
     */
@Column(name = "user_id", nullable = false)
    private Long userId;
    /**
     * 保存预约ID。
     */
@Column(name = "reservation_id")
    private Long reservationId;
    /**
     * 保存使用会话ID。
     */
@Column(name = "session_id")
    private Long sessionId;
    /**
     * 保存事件类型。
     */
@Column(name = "event_type", nullable = false)
    private String eventType;
    /**
     * 保存本次信用分变动值。
     */
@Column(name = "change_score", nullable = false)
    private Integer changeScore;
    /**
     * 保存变动前信用分。
     */
@Column(name = "before_score", nullable = false)
    private Integer beforeScore;
    /**
     * 保存变动后信用分。
     */
@Column(name = "after_score", nullable = false)
    private Integer afterScore;
    /**
     * 保存操作人用户ID。
     */
@Column(name = "operator_user_id")
    private Long operatorUserId;
    /**
     * 保存原因说明。
     */
@Column(name = "reason_text")
    private String reasonText;
    /**
     * 保存创建时间。
     */
@Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
/**
 * 构造CreditTransaction，并注入当前类运行所需的依赖对象。
 */
public CreditTransaction() {
    }
/**
 * 获取信用交易ID。
 */
public Long getCreditTxnId() {
        return this.creditTxnId;
    }
/**
 * 获取用户ID。
 */
public Long getUserId() {
        return this.userId;
    }
/**
 * 获取预约ID。
 */
public Long getReservationId() {
        return this.reservationId;
    }
/**
 * 获取使用会话ID。
 */
public Long getSessionId() {
        return this.sessionId;
    }
/**
 * 获取事件类型。
 */
public String getEventType() {
        return this.eventType;
    }
/**
 * 获取本次信用分变动值。
 */
public Integer getChangeScore() {
        return this.changeScore;
    }
/**
 * 获取变动前信用分。
 */
public Integer getBeforeScore() {
        return this.beforeScore;
    }
/**
 * 获取变动后信用分。
 */
public Integer getAfterScore() {
        return this.afterScore;
    }
/**
 * 获取操作人用户ID。
 */
public Long getOperatorUserId() {
        return this.operatorUserId;
    }
/**
 * 获取原因说明。
 */
public String getReasonText() {
        return this.reasonText;
    }
/**
 * 获取创建时间。
 */
public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }
/**
 * 设置信用交易ID。
 */
public void setCreditTxnId(final Long creditTxnId) {
        this.creditTxnId = creditTxnId;
    }
/**
 * 设置用户ID。
 */
public void setUserId(final Long userId) {
        this.userId = userId;
    }
/**
 * 设置预约ID。
 */
public void setReservationId(final Long reservationId) {
        this.reservationId = reservationId;
    }
/**
 * 设置使用会话ID。
 */
public void setSessionId(final Long sessionId) {
        this.sessionId = sessionId;
    }
/**
 * 设置事件类型。
 */
public void setEventType(final String eventType) {
        this.eventType = eventType;
    }
/**
 * 设置本次信用分变动值。
 */
public void setChangeScore(final Integer changeScore) {
        this.changeScore = changeScore;
    }
/**
 * 设置变动前信用分。
 */
public void setBeforeScore(final Integer beforeScore) {
        this.beforeScore = beforeScore;
    }
/**
 * 设置变动后信用分。
 */
public void setAfterScore(final Integer afterScore) {
        this.afterScore = afterScore;
    }
/**
 * 设置操作人用户ID。
 */
public void setOperatorUserId(final Long operatorUserId) {
        this.operatorUserId = operatorUserId;
    }
/**
 * 设置原因说明。
 */
public void setReasonText(final String reasonText) {
        this.reasonText = reasonText;
    }
/**
 * 设置创建时间。
 */
public void setCreatedAt(final LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    /**
     * 比较当前对象和另一个对象是否表示同一份业务数据。
     */
@java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof CreditTransaction)) return false;
        final CreditTransaction other = (CreditTransaction) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$creditTxnId = this.getCreditTxnId();
        final java.lang.Object other$creditTxnId = other.getCreditTxnId();
        if (this$creditTxnId == null ? other$creditTxnId != null : !this$creditTxnId.equals(other$creditTxnId)) return false;
        final java.lang.Object this$userId = this.getUserId();
        final java.lang.Object other$userId = other.getUserId();
        if (this$userId == null ? other$userId != null : !this$userId.equals(other$userId)) return false;
        final java.lang.Object this$reservationId = this.getReservationId();
        final java.lang.Object other$reservationId = other.getReservationId();
        if (this$reservationId == null ? other$reservationId != null : !this$reservationId.equals(other$reservationId)) return false;
        final java.lang.Object this$sessionId = this.getSessionId();
        final java.lang.Object other$sessionId = other.getSessionId();
        if (this$sessionId == null ? other$sessionId != null : !this$sessionId.equals(other$sessionId)) return false;
        final java.lang.Object this$changeScore = this.getChangeScore();
        final java.lang.Object other$changeScore = other.getChangeScore();
        if (this$changeScore == null ? other$changeScore != null : !this$changeScore.equals(other$changeScore)) return false;
        final java.lang.Object this$beforeScore = this.getBeforeScore();
        final java.lang.Object other$beforeScore = other.getBeforeScore();
        if (this$beforeScore == null ? other$beforeScore != null : !this$beforeScore.equals(other$beforeScore)) return false;
        final java.lang.Object this$afterScore = this.getAfterScore();
        final java.lang.Object other$afterScore = other.getAfterScore();
        if (this$afterScore == null ? other$afterScore != null : !this$afterScore.equals(other$afterScore)) return false;
        final java.lang.Object this$operatorUserId = this.getOperatorUserId();
        final java.lang.Object other$operatorUserId = other.getOperatorUserId();
        if (this$operatorUserId == null ? other$operatorUserId != null : !this$operatorUserId.equals(other$operatorUserId)) return false;
        final java.lang.Object this$eventType = this.getEventType();
        final java.lang.Object other$eventType = other.getEventType();
        if (this$eventType == null ? other$eventType != null : !this$eventType.equals(other$eventType)) return false;
        final java.lang.Object this$reasonText = this.getReasonText();
        final java.lang.Object other$reasonText = other.getReasonText();
        if (this$reasonText == null ? other$reasonText != null : !this$reasonText.equals(other$reasonText)) return false;
        final java.lang.Object this$createdAt = this.getCreatedAt();
        final java.lang.Object other$createdAt = other.getCreatedAt();
        if (this$createdAt == null ? other$createdAt != null : !this$createdAt.equals(other$createdAt)) return false;
        return true;
    }
/**
 * 配合 equals 方法使用，避免继承场景下的比较错误。
 */
protected boolean canEqual(final java.lang.Object other) {
        return other instanceof CreditTransaction;
    }
    /**
     * 返回当前对象的哈希值，便于放入集合中使用。
     */
@java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $creditTxnId = this.getCreditTxnId();
        result = result * PRIME + ($creditTxnId == null ? 43 : $creditTxnId.hashCode());
        final java.lang.Object $userId = this.getUserId();
        result = result * PRIME + ($userId == null ? 43 : $userId.hashCode());
        final java.lang.Object $reservationId = this.getReservationId();
        result = result * PRIME + ($reservationId == null ? 43 : $reservationId.hashCode());
        final java.lang.Object $sessionId = this.getSessionId();
        result = result * PRIME + ($sessionId == null ? 43 : $sessionId.hashCode());
        final java.lang.Object $changeScore = this.getChangeScore();
        result = result * PRIME + ($changeScore == null ? 43 : $changeScore.hashCode());
        final java.lang.Object $beforeScore = this.getBeforeScore();
        result = result * PRIME + ($beforeScore == null ? 43 : $beforeScore.hashCode());
        final java.lang.Object $afterScore = this.getAfterScore();
        result = result * PRIME + ($afterScore == null ? 43 : $afterScore.hashCode());
        final java.lang.Object $operatorUserId = this.getOperatorUserId();
        result = result * PRIME + ($operatorUserId == null ? 43 : $operatorUserId.hashCode());
        final java.lang.Object $eventType = this.getEventType();
        result = result * PRIME + ($eventType == null ? 43 : $eventType.hashCode());
        final java.lang.Object $reasonText = this.getReasonText();
        result = result * PRIME + ($reasonText == null ? 43 : $reasonText.hashCode());
        final java.lang.Object $createdAt = this.getCreatedAt();
        result = result * PRIME + ($createdAt == null ? 43 : $createdAt.hashCode());
        return result;
    }
    /**
     * 把当前对象转换成便于调试查看的字符串。
     */
@java.lang.Override
    public java.lang.String toString() {
        return "CreditTransaction(creditTxnId=" + this.getCreditTxnId() + ", userId=" + this.getUserId() + ", reservationId=" + this.getReservationId() + ", sessionId=" + this.getSessionId() + ", eventType=" + this.getEventType() + ", changeScore=" + this.getChangeScore() + ", beforeScore=" + this.getBeforeScore() + ", afterScore=" + this.getAfterScore() + ", operatorUserId=" + this.getOperatorUserId() + ", reasonText=" + this.getReasonText() + ", createdAt=" + this.getCreatedAt() + ")";
    }
}

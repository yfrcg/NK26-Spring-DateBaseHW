package com.mycourse.db_backend.account;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mycourse.db_backend.billing.BillingOrder;
import com.mycourse.db_backend.billing.BillingOrderRepository;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;

/**
 * 账户服务实现类。
 * 负责账户初始化、充值、流水记录以及未支付账单的自动结清。
 */
@Service
public class AccountServiceImpl implements AccountService {

    private final UserAccountRepository userAccountRepository;
    private final AccountTransactionRepository accountTransactionRepository;
    private final BillingOrderRepository billingOrderRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(UserAccountRepository userAccountRepository,
                              AccountTransactionRepository accountTransactionRepository,
                              BillingOrderRepository billingOrderRepository,
                              UserRepository userRepository) {
        this.userAccountRepository = userAccountRepository;
        this.accountTransactionRepository = accountTransactionRepository;
        this.billingOrderRepository = billingOrderRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserAccount getOrCreateAccount(Long userId) {
        return userAccountRepository.findById(userId)
                .orElseGet(() -> createEmptyAccount(userId));
    }

    @Override
    @Transactional
    public UserAccount recharge(Long userId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Recharge amount must be greater than zero");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User does not exist"));
        if (Integer.valueOf(1).equals(user.getIsDeleted())) {
            throw new BusinessException("User has been deleted");
        }

        LocalDateTime now = LocalDateTime.now();
        UserAccount account = getOrCreateAccount(userId);

        BigDecimal beforeBalance = account.getBalance();
        BigDecimal afterBalance = beforeBalance.add(amount);
        account.setBalance(afterBalance);
        account.setTotalRecharge(account.getTotalRecharge().add(amount));
        account.setUpdatedAt(now);
        UserAccount savedAccount = userAccountRepository.save(account);

        AccountTransaction transaction = new AccountTransaction();
        transaction.setTxnNo("TXN" + System.currentTimeMillis());
        transaction.setAccountUserId(userId);
        transaction.setTxnType("RECHARGE");
        transaction.setDirection("IN");
        transaction.setAmount(amount);
        transaction.setBeforeBalance(beforeBalance);
        transaction.setAfterBalance(afterBalance);
        transaction.setRemark("User recharge");
        transaction.setCreatedAt(now);
        accountTransactionRepository.save(transaction);

        return settleOutstandingBills(user, savedAccount, now);
    }

    @Override
    public List<AccountTransaction> listTransactions(Long userId) {
        return accountTransactionRepository.findByAccountUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * 用当前余额按时间顺序清偿未支付账单。
     */
    private UserAccount settleOutstandingBills(User user, UserAccount account, LocalDateTime now) {
        List<BillingOrder> unpaidBills = billingOrderRepository
                .findByUserIdAndBillStatusOrderByCreatedAtAsc(user.getUserId(), "UNPAID");

        BigDecimal arrearsAmount = safeAmount(account.getArrearsAmount());
        for (BillingOrder bill : unpaidBills) {
            BigDecimal unpaidAmount = bill.getPayableAmount().subtract(safeAmount(bill.getPaidAmount()));
            if (unpaidAmount.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }
            if (account.getBalance().compareTo(unpaidAmount) < 0) {
                break;
            }

            BigDecimal beforeBalance = account.getBalance();
            BigDecimal afterBalance = beforeBalance.subtract(unpaidAmount);

            account.setBalance(afterBalance);
            account.setTotalSpend(account.getTotalSpend().add(unpaidAmount));
            account.setLastSettlementTime(now);
            account.setUpdatedAt(now);

            arrearsAmount = arrearsAmount.subtract(unpaidAmount);
            if (arrearsAmount.compareTo(BigDecimal.ZERO) < 0) {
                arrearsAmount = BigDecimal.ZERO;
            }
            account.setArrearsAmount(arrearsAmount);
            userAccountRepository.save(account);

            bill.setBillStatus("PAID");
            bill.setPaidAmount(bill.getPayableAmount());
            bill.setSettledAt(now);
            bill.setUpdatedAt(now);
            BillingOrder savedBill = billingOrderRepository.save(bill);

            AccountTransaction transaction = new AccountTransaction();
            transaction.setTxnNo("TXN" + System.currentTimeMillis());
            transaction.setAccountUserId(user.getUserId());
            transaction.setReservationId(savedBill.getReservationId());
            transaction.setBillId(savedBill.getBillId());
            transaction.setTxnType("CONSUME");
            transaction.setDirection("OUT");
            transaction.setAmount(unpaidAmount);
            transaction.setBeforeBalance(beforeBalance);
            transaction.setAfterBalance(afterBalance);
            transaction.setRemark("Auto-settled unpaid bill after recharge");
            transaction.setCreatedAt(now);
            accountTransactionRepository.save(transaction);
        }

        if (safeAmount(account.getArrearsAmount()).compareTo(BigDecimal.ZERO) > 0) {
            if (!"ARREARS_LOCKED".equals(user.getAccountStatus())) {
                user.setAccountStatus("ARREARS_LOCKED");
                user.setUpdatedAt(now);
                userRepository.save(user);
            }
        } else if ("ARREARS_LOCKED".equals(user.getAccountStatus())) {
            user.setAccountStatus("ACTIVE");
            user.setUpdatedAt(now);
            userRepository.save(user);
        }

        return userAccountRepository.save(account);
    }

    /**
     * 为用户创建初始账户记录。
     */
    private UserAccount createEmptyAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User does not exist"));
        if (Integer.valueOf(1).equals(user.getIsDeleted())) {
            throw new BusinessException("User has been deleted");
        }

        LocalDateTime now = LocalDateTime.now();
        UserAccount account = new UserAccount();
        account.setUserId(userId);
        account.setBalance(BigDecimal.ZERO);
        account.setFrozenAmount(BigDecimal.ZERO);
        account.setArrearsAmount(BigDecimal.ZERO);
        account.setTotalRecharge(BigDecimal.ZERO);
        account.setTotalSpend(BigDecimal.ZERO);
        account.setVersionNo(0);
        account.setCreatedAt(now);
        account.setUpdatedAt(now);
        return userAccountRepository.save(account);
    }

    /**
     * 把可能为 null 的金额安全转换成 0。
     */
    private BigDecimal safeAmount(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}

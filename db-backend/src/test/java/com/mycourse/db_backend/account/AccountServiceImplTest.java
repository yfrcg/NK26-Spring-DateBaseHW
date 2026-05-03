package com.mycourse.db_backend.account;

import com.mycourse.db_backend.billing.BillingOrder;
import com.mycourse.db_backend.billing.BillingOrderRepository;
import com.mycourse.db_backend.user.User;
import com.mycourse.db_backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private AccountTransactionRepository accountTransactionRepository;
    @Mock
    private BillingOrderRepository billingOrderRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AccountServiceImpl accountService;

    @Test
    void rechargeShouldSettleUnpaidBillsAndUnlockAccount() {
        User user = new User();
        user.setUserId(7L);
        user.setIsDeleted(0);
        user.setAccountStatus("ARREARS_LOCKED");

        UserAccount account = new UserAccount();
        account.setUserId(7L);
        account.setBalance(BigDecimal.ZERO);
        account.setFrozenAmount(BigDecimal.ZERO);
        account.setArrearsAmount(new BigDecimal("20.00"));
        account.setTotalRecharge(BigDecimal.ZERO);
        account.setTotalSpend(BigDecimal.ZERO);
        account.setVersionNo(0);
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());

        BillingOrder bill = new BillingOrder();
        bill.setBillId(3L);
        bill.setReservationId(9L);
        bill.setUserId(7L);
        bill.setBillStatus("UNPAID");
        bill.setPayableAmount(new BigDecimal("20.00"));
        bill.setPaidAmount(BigDecimal.ZERO);
        bill.setCreatedAt(LocalDateTime.now());

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(userAccountRepository.findById(7L)).thenReturn(Optional.of(account));
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(billingOrderRepository.findByUserIdAndBillStatusOrderByCreatedAtAsc(7L, "UNPAID"))
                .thenReturn(List.of(bill));
        when(billingOrderRepository.save(any(BillingOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(accountTransactionRepository.save(any(AccountTransaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserAccount saved = accountService.recharge(7L, new BigDecimal("30.00"));

        assertEquals(new BigDecimal("10.00"), saved.getBalance());
        assertEquals(0, saved.getArrearsAmount().compareTo(BigDecimal.ZERO));
        assertEquals(new BigDecimal("20.00"), saved.getTotalSpend());
        assertEquals("ACTIVE", user.getAccountStatus());
        assertEquals("PAID", bill.getBillStatus());
        assertEquals(new BigDecimal("20.00"), bill.getPaidAmount());
        assertNotNull(bill.getSettledAt());

        ArgumentCaptor<AccountTransaction> transactionCaptor = ArgumentCaptor.forClass(AccountTransaction.class);
        verify(accountTransactionRepository, atLeastOnce()).save(transactionCaptor.capture());
        assertEquals(2, transactionCaptor.getAllValues().size());
    }
}

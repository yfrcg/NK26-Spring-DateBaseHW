package com.mycourse.db_backend.session;

import com.mycourse.db_backend.account.AccountTransactionRepository;
import com.mycourse.db_backend.account.UserAccountRepository;
import com.mycourse.db_backend.billing.BillingOrderRepository;
import com.mycourse.db_backend.common.BusinessException;
import com.mycourse.db_backend.credit.CreditService;
import com.mycourse.db_backend.pricing.PricingPolicyRepository;
import com.mycourse.db_backend.reservation.Reservation;
import com.mycourse.db_backend.reservation.ReservationRepository;
import com.mycourse.db_backend.runtime.SpaceRuntimeStatusRepository;
import com.mycourse.db_backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsageSessionServiceImplTest {

    @Mock
    private UsageSessionRepository usageSessionRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private PricingPolicyRepository pricingPolicyRepository;
    @Mock
    private SpaceRuntimeStatusRepository runtimeStatusRepository;
    @Mock
    private BillingOrderRepository billingOrderRepository;
    @Mock
    private UserAccountRepository userAccountRepository;
    @Mock
    private AccountTransactionRepository accountTransactionRepository;
    @Mock
    private CreditService creditService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UsageSessionServiceImpl usageSessionService;

    @Test
    void checkInShouldRejectBeforeReservationStartTime() {
        Reservation reservation = new Reservation();
        reservation.setReservationId(10L);
        reservation.setReservationStatus("CONFIRMED");
        reservation.setStartTime(LocalDateTime.now().plusHours(1));
        reservation.setEndTime(LocalDateTime.now().plusHours(3));

        when(reservationRepository.findById(10L)).thenReturn(Optional.of(reservation));

        assertThrows(BusinessException.class, () -> usageSessionService.checkIn(10L));

        verify(usageSessionRepository, never()).save(org.mockito.ArgumentMatchers.any());
        verify(runtimeStatusRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }
}

package com.mycourse.db_backend.billing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.mycourse.db_backend.common.BusinessException;

@ExtendWith(MockitoExtension.class)
class BillingControllerTest {

    @Mock
    private BillingOrderRepository billingOrderRepository;

    @InjectMocks
    private BillingController billingController;

    @Test
    void getByReservationShouldThrowBusinessExceptionWhenBillDoesNotExist() {
        when(billingOrderRepository.findByReservationId(1L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
                () -> billingController.getByReservation(1L));

        assertEquals("Bill does not exist", ex.getMessage());
    }
}

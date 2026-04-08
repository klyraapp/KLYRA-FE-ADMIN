import { useTranslation } from '@/hooks/useTranslation';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button, Typography } from 'antd';
import { useState } from 'react';
import styles from './StripeCardUpdate.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const { Text } = Typography;

const CardForm = ({ onUpdate, loading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      onUpdate(paymentMethod.id);
      // Clear the card input field after success
      cardElement.clear();
    }
  };

  return (
    <div className={styles.cardContainer}>
      <Text strong className={styles.label}>{t('common.updateCard') || 'Update Card Details'}</Text>
      <div className={styles.cardWrapper}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className={styles.errorText}>{error}</div>}
      <Button
        type="primary"
        htmlType="button"
        onClick={handleSubmit}
        loading={loading}
        disabled={!stripe}
        className={styles.updateButton}
      >
        {t('common.updateCard') || 'Update Card'}
      </Button>
    </div>
  );
};

const StripeCardUpdate = ({ onUpdate, loading }) => {
  return (
    <Elements stripe={stripePromise}>
      <CardForm onUpdate={onUpdate} loading={loading} />
    </Elements>
  );
};

export default StripeCardUpdate;

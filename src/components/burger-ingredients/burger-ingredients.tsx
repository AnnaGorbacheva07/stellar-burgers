import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const { ingredients, isLoading, error } = useSelector(
    (state) => state.ingredients
  );
  if (!ingredients || ingredients.length === 0) {
    return <div>Ингредиенты не загружены</div>;
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки</div>;
  }

  // Оптимизируем мемоизацию
  const [buns, mains, sauces] = useMemo(() => {
    const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
    const mains = ingredients.filter(
      (ingredient) => ingredient.type === 'main'
    );
    const sauces = ingredients.filter(
      (ingredient) => ingredient.type === 'sauce'
    );
    return [buns, mains, sauces];
  }, [ingredients]);
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};

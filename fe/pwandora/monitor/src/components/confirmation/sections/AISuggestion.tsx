import { useEffect, useState } from 'react'
import ConfirmItem from '../appData/ConfirmItem'
import ConfirmSection from '../appData/ConfirmSection'
import ConfirmItemTextarea from '../appData/ConfirmItemTextarea'
import ConfirmItemChipList from '../appData/ConfirmItemChipList'
import { useConfirmation } from '../../../contexts/ConfirmationContext'
import { SelectModal, useSelectModal } from '../../common/SelectModal'
import { useCategoryListByLanguage } from '../../../apis/app'
import { ICategory } from '../../../types/appDetail'
import { AGE_RATINGS } from '../../../consts/AGE_RATINGS'
import ConfirmItemSelect from '../appData/ConfirmItemSelect'
import { Kr, Us } from 'react-flags-select'
import { IConfirmSectionCommonProps } from '../../../types/confirmSection'
import { useTranslation } from 'react-i18next'

export default function AISuggestion({
  confirm,
  status,
}: IConfirmSectionCommonProps) {
  const { t } = useTranslation()
  const { appData, setAppData } = useConfirmation()
  const [language, setLanguage] = useState<string>('en')
  const aiSuggestions = appData.aiSuggestionStepDto.aiSuggestionDtoMap
  const {
    isOpen: isCategoryModalOpen,
    openModal: openCategoryModal,
    closeModal: closeCategoryModal,
  } = useSelectModal()
  const {
    isOpen: isAgeRatingModalOpen,
    openModal: openAgeRatingModal,
    closeModal: closeAgeRatingModal,
  } = useSelectModal()

  const { data: categoryObjects } = useCategoryListByLanguage(language)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    if (!categoryObjects) return
    const categoryList = categoryObjects.map(
      (category: ICategory) => category.name,
    )
    setCategories(categoryList)
  }, [categoryObjects])

  // Updating nested fields
  const handleChange = (
    language: string,
    field: string, // Ensure type safety
    value: any,
  ) => {
    setAppData(prev =>
      !prev
        ? undefined
        : {
            ...prev,
            aiSuggestionStepDto: {
              ...prev.aiSuggestionStepDto,
              aiSuggestionDtoMap: {
                ...prev.aiSuggestionStepDto.aiSuggestionDtoMap,
                [language]: {
                  ...prev.aiSuggestionStepDto.aiSuggestionDtoMap[language],
                  [field]: value,
                },
              },
            },
          },
    )
  }

  const onCategorySelect = (category: { id: number; name: string }) => {
    const newCategory = {
      id: category.id,
      name: category.name,
    }
    const existingCategories = aiSuggestions[language].categories || []
    const updatedCategories = [...existingCategories, newCategory]

    handleChange(language, 'categories', updatedCategories)
    closeCategoryModal()
  }

  const removeCategory = (categoryId: number) => {
    handleChange(
      language,
      'categories',
      aiSuggestions[language].categories.filter(cat => cat.id !== categoryId),
    )
  }

  const onAgeRatingSelect = (ageRating: string) => {
    handleChange(language, 'ageRating', ageRating)
    closeAgeRatingModal()
  }

  const languages = [
    {
      code: 'en',
      flag: <Us />,
      value: 'English',
      name: 'English',
      checked: language === 'en',
      onClick: setLanguage,
    },
    {
      code: 'ko',
      flag: <Kr />,
      value: 'Korean',
      name: 'Korean',
      checked: language === 'ko',
      onClick: setLanguage,
    },
  ]

  return (
    <ConfirmSection
      name='aiSuggestions'
      languages={languages}
      status={status}
      confirm={confirm}
    >
      <ConfirmItem name={t('Summary')}>
        <ConfirmItemTextarea
          value={aiSuggestions[language].summary}
          setValue={(value: string) => handleChange(language, 'summary', value)}
          placeholder='Summary'
          rows={2}
          maxLength={200}
          className='w-full'
        />
      </ConfirmItem>
      <ConfirmItem name={t('Description')}>
        <ConfirmItemTextarea
          value={aiSuggestions[language].description}
          setValue={(value: string) =>
            handleChange(language, 'description', value)
          }
          placeholder='Description'
          rows={3}
          maxLength={500}
          className='w-full'
        />
      </ConfirmItem>
      <ConfirmItem name={t('Categories')}>
        <ConfirmItemChipList
          items={aiSuggestions[language].categories}
          onAdd={openCategoryModal}
          onRemove={removeCategory}
        />
      </ConfirmItem>

      <SelectModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        items={categoryObjects}
        names={categories}
        onSelect={onCategorySelect}
      />

      <ConfirmItem name={t('Age Rating')}>
        <ConfirmItemSelect
          value={aiSuggestions[language].ageRating}
          onChange={openAgeRatingModal}
        />

        <SelectModal
          isOpen={isAgeRatingModalOpen}
          onClose={closeAgeRatingModal}
          items={AGE_RATINGS}
          names={AGE_RATINGS}
          onSelect={onAgeRatingSelect}
        />
      </ConfirmItem>
    </ConfirmSection>
  )
}

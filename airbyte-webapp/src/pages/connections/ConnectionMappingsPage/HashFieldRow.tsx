import { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";

import { FlexContainer } from "components/ui/Flex";
import { Icon } from "components/ui/Icon";
import { ListBox, ListBoxControlButtonProps } from "components/ui/ListBox";
import { Text } from "components/ui/Text";

import {
  HashingMapperConfiguration,
  HashingMapperConfigurationMethod,
  StreamMapperType,
} from "core/api/types/AirbyteClient";

import { autoSubmitResolver } from "./autoSubmitResolver";
import { useMappingContext } from "./MappingContext";
import { MappingRowContent, MappingRowItem } from "./MappingRow";
import styles from "./MappingRow.module.scss";
import { MappingTypeListBox } from "./MappingTypeListBox";
import { SelectTargetField } from "./SelectTargetField";
import { StreamMapperWithId } from "./types";

const hashingMapperConfigSchema = yup.object().shape({
  targetField: yup.string().required("form.empty.error"),
  method: yup
    .mixed<HashingMapperConfigurationMethod>()
    .oneOf(Object.values(HashingMapperConfigurationMethod))
    .required("form.empty.error"),
  fieldNameSuffix: yup.string().required("form.empty.error"),
});

export const HashFieldRow: React.FC<{
  mapping: StreamMapperWithId<HashingMapperConfiguration>;
  streamDescriptorKey: string;
}> = ({ mapping, streamDescriptorKey }) => {
  const { updateLocalMapping, validatingStreams } = useMappingContext();

  const isStreamValidating = validatingStreams.has(streamDescriptorKey);

  const defaultValues = useMemo(() => {
    return {
      targetField: mapping.mapperConfiguration.targetField ?? "",
      method: mapping.mapperConfiguration.method ?? HashingMapperConfigurationMethod.MD5,
      fieldNameSuffix: mapping.mapperConfiguration.fieldNameSuffix ?? "_hashed",
    };
  }, [mapping]);

  const methods = useForm<HashingMapperConfiguration>({
    defaultValues,
    resolver: autoSubmitResolver<HashingMapperConfiguration>(hashingMapperConfigSchema, (formValues) => {
      updateLocalMapping(streamDescriptorKey, mapping.id, { mapperConfiguration: formValues });
    }),
    mode: "onBlur",
  });

  useEffect(() => {
    updateLocalMapping(streamDescriptorKey, mapping.id, { validationCallback: methods.trigger }, true);
  }, [methods.trigger, streamDescriptorKey, updateLocalMapping, mapping.id]);

  useEffect(() => {
    if (mapping.validationError && mapping.validationError.type === "FIELD_NOT_FOUND") {
      methods.setError("targetField", { message: mapping.validationError.message });
    } else {
      methods.clearErrors("targetField");
    }
  }, [mapping.validationError, methods]);

  if (!mapping) {
    return null;
  }
  return (
    <FormProvider {...methods}>
      <form>
        <MappingRowContent>
          <MappingTypeListBox
            disabled={isStreamValidating}
            selectedValue={StreamMapperType.hashing}
            mappingId={mapping.id}
            streamDescriptorKey={streamDescriptorKey}
          />
          <MappingRowItem>
            <SelectTargetField<HashingMapperConfiguration>
              name="targetField"
              mappingId={mapping.id}
              streamDescriptorKey={streamDescriptorKey}
              disabled={isStreamValidating}
            />
          </MappingRowItem>
          <MappingRowItem>
            <Text>
              <FormattedMessage id="connections.mappings.using" />
            </Text>
          </MappingRowItem>
          <MappingRowItem>
            <SelectHashingMethod disabled={isStreamValidating} />
          </MappingRowItem>
        </MappingRowContent>
        {mapping.validationError && mapping.validationError.type !== "FIELD_NOT_FOUND" && (
          <Text italicized color="red">
            {mapping.validationError.message}
          </Text>
        )}
      </form>
    </FormProvider>
  );
};

const SelectHashingMethodControlButton: React.FC<ListBoxControlButtonProps<HashingMapperConfigurationMethod>> = ({
  selectedOption,
  isDisabled,
}) => {
  if (!selectedOption) {
    return (
      <Text color="grey">
        <FormattedMessage id="connections.mappings.hashing.method" />
      </Text>
    );
  }

  return (
    <FlexContainer alignItems="center" gap="none">
      <Text color={isDisabled ? "grey300" : "darkBlue"}>{selectedOption.label}</Text>
      <Icon type="caretDown" color="disabled" />
    </FlexContainer>
  );
};

const supportedHashTypes = [
  { label: "MD5", value: HashingMapperConfigurationMethod.MD5 },
  { label: "SHA-256", value: HashingMapperConfigurationMethod["SHA-256"] },
  { label: "SHA-512", value: HashingMapperConfigurationMethod["SHA-512"] },
];

const SelectHashingMethod: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { control } = useFormContext<HashingMapperConfiguration>();

  return (
    <Controller
      name="method"
      control={control}
      defaultValue={HashingMapperConfigurationMethod.MD5}
      render={({ field }) => (
        <ListBox
          buttonClassName={styles.controlButton}
          controlButton={SelectHashingMethodControlButton}
          isDisabled={disabled}
          onSelect={(value) => {
            field.onChange(value);
            // We're using onBlur mode, so we need to manually trigger the validation
            field.onBlur();
          }}
          selectedValue={field.value}
          options={supportedHashTypes}
        />
      )}
    />
  );
};

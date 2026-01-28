import { useState } from 'react';
import { Row, Col } from 'antd';
import { ModuleTopHeading } from '../../components';
import { t } from 'i18next';
import Title from 'antd/es/skeleton/Title';

const SettingsPage = () => {
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <ModuleTopHeading level={4} name={t('System State')} />
                </Col>
                <Col span={24}>
                <ModuleTopHeading level={4} name={t('Table with following columns')} />
                <ModuleTopHeading level={4} name={'Key (KILL_SWITCH / PAUSE / FEATURE_TOGGL)'} />
                <ModuleTopHeading level={4} name={t('Value (ON / OFF)')} />
                <ModuleTopHeading level={4} name={t('Updated By')} />
                <ModuleTopHeading level={4} name={t('Updated At')} />
                </Col>
            </Row>
        </>
    )
}

export {SettingsPage}
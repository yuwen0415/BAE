#pragma once
#include "Common.h"

class ControlHandler : public osgGA::GUIEventHandler
{
public:
	ControlHandler(osgViewer::Viewer *viewer);
	~ControlHandler();
	bool handle(const osgGA::GUIEventAdapter& ea, osgGA::GUIActionAdapter& aa);

	void ChangeScenceModel(char modelfile[]);
	void DynamicPositionChangeModel(float screenX, float screenY, char modelfile[]);
	void DynamicPositionChangeModel(char modelfile[]);

private:
	osg::ref_ptr<osgViewer::Viewer> m_Viewer;
};
bl_info = {
    "name": "Still and Motion Tools",
    "author": "Your Name",
    "version": (1, 0),
    "blender": (2, 80, 0),
    "location": "View3D > Tools",
    "description": "Provides tools for still and motion graphics",
    "warning": "",
    "doc_url": "",
    "category": "3D View",
}

import bpy

class StillsPanel(bpy.types.Panel):
    bl_label = "Stills"
    bl_idname = "VIEW3D_PT_stills"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Still and Motion Tools'

    def draw(self, context):
        layout = self.layout

        row = layout.row()
        row.operator("view3d.still_tool_1", text="Still Tool 1")
        row.operator("view3d.still_tool_2", text="Still Tool 2")

class MotionPanel(bpy.types.Panel):
    bl_label = "Motion"
    bl_idname = "VIEW3D_PT_motion"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Still and Motion Tools'

    def draw(self, context):
        layout = self.layout

        row = layout.row()
        row.operator("view3d.motion_tool_1", text="Motion Tool 1")
        row.operator("view3d.motion_tool_2", text="Motion Tool 2")

class StillTool1(bpy.types.Operator):
    bl_idname = "view3d.still_tool_1"
    bl_label = "Still Tool 1"

    def execute(self, context):
        # Add your code for Still Tool 1 here
        bpy.data.scenes['Scene'].display.shading.light = 'CYCLES'
        self.report({'INFO'}, "Still Tool 1 executed")
        return {'FINISHED'}

class StillTool2(bpy.types.Operator):
    bl_idname = "view3d.still_tool_2"
    bl_label = "Still Tool 2"

    def execute(self, context):
        # Add your code for Still Tool 2 here
        self.report({'INFO'}, "Still Tool 2 executed")
        return {'FINISHED'}

class MotionTool1(bpy.types.Operator):
    bl_idname = "view3d.motion_tool_1"
    bl_label = "Motion Tool 1"

    def execute(self, context):
        # Add your code for Motion Tool 1 here
        self.report({'INFO'}, "Motion Tool 1 executed")
        return {'FINISHED'}

class MotionTool2(bpy.types.Operator):
    bl_idname = "view3d.motion_tool_2"
    bl_label = "Motion Tool 2"

    def execute(self, context):
        # Add your code for Motion Tool 2 here
        self.report({'INFO'}, "Motion Tool 2 executed")
        return {'FINISHED'}

classes = (
    StillsPanel,
    MotionPanel,
    StillTool1,
    StillTool2,
    MotionTool1,
    MotionTool2,
)

register, unregister = bpy.utils.register_classes_factory(classes)

if __name__ == "__main__":
    register()